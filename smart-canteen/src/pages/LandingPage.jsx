import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-bg">
            <div className="overlay"></div>
            <div className="landing-content">
                <div className="logo-section">
                    <span className="icon">🍱</span>
                    <h1>Smart<span>Canteen</span></h1>
                </div>
                <p className="tagline">Fresh Food. Fast Delivery. Digital Experience.</p>
                
                <div className="card-container">
                    <div className="login-card student" onClick={() => navigate('/login?role=student')}>
                        <h3>Student Portal</h3>
                        <p>Order food & track your cravings</p>
                        <button className="go-btn">Order Now →</button>
                    </div>

                    <div className="login-card admin" onClick={() => navigate('/login?role=admin')}>
                        <h3>Admin Panel</h3>
                        <p>Manage menu & live kitchen</p>
                        <button className="go-btn">Dashboard →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;