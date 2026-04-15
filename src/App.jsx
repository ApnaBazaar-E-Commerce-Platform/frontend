import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import MyOrders from './pages/MyOrders';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <ToastContainer position="top-right" autoClose={3000} />
        
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />

            <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />

            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/create-product" element={user ? <CreateProduct /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;