import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={{
      backgroundColor: '#007bff',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <Link 
        to="/dashboard" 
        style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '24px', 
          fontWeight: 'bold' 
        }}
      >
        GoSupportMe
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link 
            to="/dashboard" 
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link 
            to="/create-campaign" 
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Create Campaign
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
