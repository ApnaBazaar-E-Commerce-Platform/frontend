import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, userPincode, isRecommended }) => {
  const { addToCart } = useContext(CartContext);

  const isNearby = product.shopId?.addressId?.pincode === userPincode;

  const handleAdd = () => {
    addToCart(product);
    toast.info(`${product.name} added to cart! 🛒`, {
      position: "bottom-right",
      autoClose: 1500,
    });
  };

  return (
    <div style={{ 
      border: isRecommended ? '2px solid #f1c40f' : '1px solid #e0e0e0', 
      borderRadius: '12px', 
      padding: '15px', 
      width: '260px', 
      backgroundColor: 'white', 
      position: 'relative',
      boxShadow: isRecommended ? '0 10px 20px rgba(241, 196, 15, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s ease',
      cursor: 'default'
    }}>
      
      {isRecommended && (
        <div style={{ 
          position: 'absolute', 
          top: '-12px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: '#f1c40f', 
          color: '#000', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.7rem', 
          fontWeight: '900',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1,
          whiteSpace: 'nowrap'
        }}>
          ✨ BEST VALUE / NEAREST
        </div>
      )}

      <img 
        src={product.imageUrl || 'https://via.placeholder.com/150'} 
        alt={product.name} 
        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} 
      />

      <div style={{ marginTop: '15px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#2c3e50' }}>{product.name}</h3>
        <p style={{ fontWeight: 'bold', color: '#2ecc71', fontSize: '1.3rem', margin: '0 0 10px 0' }}>₹{product.price}</p>
        
        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
          <p style={{ margin: '0' }}>🏪 {product.shopId?.name}</p>
          <p style={{ margin: '2px 0 15px 0' }}>📍 {product.shopId?.addressId?.city}</p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isNearby ? (
          <span style={{ background: '#fff9db', color: '#f08c00', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            🚀 Same Area
          </span>
        ) : (
          <span style={{ color: '#bdc3c7', fontSize: '0.75rem' }}>Standard Shipping</span>
        )}
        
        <button 
          onClick={handleAdd} 
          style={{ 
            background: isRecommended ? '#f1c40f' : '#3498db', 
            color: isRecommended ? '#000' : 'white', 
            border: 'none', 
            padding: '8px 14px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;