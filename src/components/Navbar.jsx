import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clears Context and LocalStorage
        navigate('/login'); // Sends them back to the login screen
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '15px 30px', 
            background: '#2c3e50', 
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
      
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ApnaBazaar
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {user ? (
                <>
                    <span style={{ fontStyle: 'italic', color: '#bdc3c7' }}>
                        Welcome, {user.name.split(' ')[0]}
                    </span>

                    {user.role === 'Merchant' ? (
                        <Link to="/dashboard" style={{ color: '#2ecc71', textDecoration: 'none', fontWeight: 'bold' }}>
                            🏪 My Shop
                        </Link>
                    ) : (
                        <Link to="/my-orders" style={{ color: '#f39c12', textDecoration: 'none', fontWeight: 'bold' }}>
                            📦 My Orders
                        </Link>
                    )}

                    <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginRight: '15px' }}>
                        🛒 Cart
                    </Link>

                    <button onClick={handleLogout} 
                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' 
                      
                    }}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                    <Link to="/register" style={{ background: '#3498db', color: 'white', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none' }}>
                        Register
                    </Link>
                </>
            )}
        </div>
    </nav>
  );
};

export default Navbar;