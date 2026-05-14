import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag, Clock, LogOut, User } from 'lucide-react';

// Import CSS
import '../Styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🛡️ SECURITY GUARD: Login check
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      navigate('/login', { replace: true });
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        setUser(parsedUser);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Student Dashboard</h2>
        <button onClick={handleLogout} className="dashboard-logout-btn">
          <LogOut size={18}/> Logout
        </button>
      </div>
      
      <div className="dashboard-welcome-card">
        <h3>Hello, {user.name}! 👋</h3>
        <p>Email: {user.email} | Role: {user.role.toUpperCase()}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/menu')}>
          <Utensils size={45} color="#e17055" />
          <h3>Browse Menu</h3>
        </div>
        
        <div className="dashboard-card" onClick={() => navigate('/cart')}>
          <ShoppingBag size={45} color="#00b894" />
          <h3>My Cart</h3>
        </div>
        
        <div className="dashboard-card" onClick={() => navigate('/my-orders')}>
          <Clock size={45} color="#0984e3" />
          <h3>My Orders</h3>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/profile')}>
          <User size={45} color="#6c5ce7" />
          <h3>My Profile</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;