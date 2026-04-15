import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: searchKeyword,
        userPincode: user?.addressId?.pincode || '',
        userCity: user?.addressId?.city || ''
      });

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products. Check server connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '40px 20px', background: '#f8f9fa', borderRadius: '15px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>ApnaBazaar</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>Smart Hyperlocal Shopping: Nearest & Cheapest First.</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="What are you looking for today?" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ 
              padding: '15px', 
              width: '400px', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              fontSize: '1rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
          <button type="submit" style={{ 
            padding: '15px 30px', 
            background: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div className="spinner" style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #3498db', 
            borderRadius: '50%', 
            width: '50px', 
            height: '50px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto' 
          }}></div>
          <p style={{ marginTop: '20px', color: '#7f8c8d', fontWeight: 'bold' }}>Finding the best deals in {user?.addressId?.city || 'your area'}...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#95a5a6' }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3>No matches found</h3>
          <p>Try searching for something else or broaden your search.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '40px',
          justifyItems: 'center' 
        }}>
          {products.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              userPincode={user?.addressId?.pincode} 
              isRecommended={index === 0}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Home;