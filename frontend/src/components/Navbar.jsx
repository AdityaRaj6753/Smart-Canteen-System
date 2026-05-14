import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
// Correct path to the Styles folder based on your screenshot
import '../Styles/Home.css'; 

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo-box">
        <div className="logo-icon">
          <Utensils size={24} color="white" />
        </div>
        <h2 className="brand-name">Smart Canteen</h2>
      </div>
      <button onClick={() => navigate('/login')} className="nav-login-btn">
        Login
      </button>
    </nav>
  );
}

export default Navbar;