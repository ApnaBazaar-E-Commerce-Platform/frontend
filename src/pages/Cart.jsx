import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      const shopId = cartItems[0].shopId._id || cartItems[0].shopId;

      const orderData = {
        shopId: shopId,
        totalAmount: totalAmount,
        orderItems: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await api.post('/orders', orderData);
      
      toast.success('Order Placed Successfully! 🎉');
      clearCart();
      navigate('/my-orders'); 

    } catch (error) {
      toast.error('Error placing order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Go find some hyperlocal products!</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#7f8c8d' }}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>₹{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '30px', padding: '20px', background: '#ecf0f1', borderRadius: '8px', textAlign: 'right' }}>
            <h3>Total: ₹{totalAmount}</h3>
            <button 
              onClick={handleCheckout} 
              disabled={loading}
              style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;