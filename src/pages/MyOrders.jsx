import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'Merchant') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders'); 
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your orders');
      }
      setLoading(false);
    };

    if (user?.role === 'User') {
      fetchMyOrders();
    }
  }, [user]);

  if (loading) return <h2>Loading your order history...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>📦 My Purchase History</h2>

      {error && <p style={{ color: 'red', background: '#ffebee', padding: '10px' }}>{error}</p>}

      {orders.length === 0 ? (
        <div style={{ padding: '40px', background: '#ecf0f1', borderRadius: '8px', textAlign: 'center' }}>
          <h3>You haven't placed any orders yet!</h3>
          <p>Go to the home page to find items near you.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '10px', padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid #bdc3c7', borderRadius: '8px', padding: '20px', background: 'white' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Order ID: {order._id}</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: order.status === 'Pending' ? '#f39c12' : '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {order.status || 'Processing'}
                  </span>
                </div>
              </div>

              <div>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px dashed #bdc3c7', textAlign: 'right' }}>
                <h3 style={{ margin: 0 }}>Total Paid: <span style={{ color: '#2ecc71' }}>₹{order.totalAmount}</span></h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;