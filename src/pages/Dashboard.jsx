import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'Merchant') {
      navigate('/');
    } else {
      fetchMerchantOrders();
    }
  }, [user, navigate]);

  const fetchMerchantOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/merchant');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders from server');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      if (response.status === 200) {
        toast.success(`Order status updated to: ${newStatus} ✅`);
        fetchMerchantOrders();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      toast.error(`Error: ${errorMsg}`);
      
      fetchMerchantOrders();
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '15px', color: '#7f8c8d' }}>Fetching your orders...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50' }}>🏪 Merchant Dashboard</h2>
        <button 
          onClick={() => navigate('/create-product')} 
          style={{ background: '#2ecc71', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(46, 204, 113, 0.3)' }}
        >
          + Add New Product
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '60px', background: '#f8f9fa', textAlign: 'center', borderRadius: '12px', border: '2px dashed #bdc3c7' }}>
          <h3 style={{ color: '#95a5a6' }}>No orders found yet! 📦</h3>
          <p style={{ color: '#7f8c8d' }}>Once customers buy your products, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Order #{order._id.slice(-6).toUpperCase()}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#34495e' }}><strong>Buyer:</strong> {order.userId?.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#7f8c8d' }}>{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#95a5a6', marginBottom: '5px', textTransform: 'uppercase' }}>Update Status</label>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '2px solid #3498db', 
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#3498db'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#fcfcfc', padding: '15px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: 'bold', color: '#7f8c8d' }}>ORDERED ITEMS</p>
                {order.orderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: '500' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Payment Status: <strong style={{ color: '#2ecc71' }}>Paid</strong></span>
                <h3 style={{ margin: 0, color: '#2ecc71' }}>Total Amount: ₹{order.totalAmount}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;