import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Login.css'; // Wahi login wala CSS use karenge consistency ke liye

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/register', formData);
            alert(res.data.message);
            navigate('/login?role=student');
        } catch (err) {
            alert("Registration failed. Email might already exist.");
        }
    };

    return (
        <div className="login-wrapper"> {/* Background ke liye login-wrapper hi use karo */}
            <div className="login-glass-card">
                <h2>🎓 Student Registration</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Join the Smart Canteen community</p>
                
                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" placeholder="Enter your full name" required 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" placeholder="student@university.com" required 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div className="input-group">
                        <label>Create Password</label>
                        <input 
                            type="password" placeholder="••••••••" required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <button type="submit" className="login-submit-btn">Create Account</button>
                </form>

                <p className="auth-footer" style={{ textAlign: 'center', marginTop: '15px' }}>
                    Already have an account? <Link to="/login?role=student" style={{ color: '#ff6b00', fontWeight: 'bold' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;