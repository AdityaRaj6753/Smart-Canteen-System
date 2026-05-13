import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Added Link import
import axios from 'axios';
import '../Styles/Login.css';

function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role') || 'student';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) return alert("Please enter your email address!");
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/send-otp', { email });
            alert(res.data.message);
            setOtpSent(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error: Could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const url = role === 'admin' ? '/api/admin/verify-login' : '/api/login';
        const data = role === 'admin' ? { email, otp } : { email, password };

        try {
            const res = await axios.post(`http://localhost:5000${url}`, data);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/menu');
        } catch (err) {
            alert(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-glass-card">
                <h2>{role === 'admin' ? '🛡️ Admin Access' : '🎓 Student Login'}</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {role === 'student' ? (
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    ) : (
                        <div className="otp-container">
                            {otpSent ? (
                                <div className="input-group">
                                    <label>Enter OTP Code</label>
                                    <input type="text" placeholder="6-digit code" onChange={(e) => setOtp(e.target.value)} required />
                                </div>
                            ) : (
                                <button type="button" onClick={handleSendOTP} className="otp-btn" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Get OTP on Email'}
                                </button>
                            )}
                        </div>
                    )}

                    {(role === 'student' || otpSent) && (
                        <button type="submit" className="login-submit-btn">Login</button>
                    )}
                </form>

                {/* 🔥 Link for Student Registration added here */}
                {role === 'student' && (
                    <p className="auth-footer" style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
                        New student? <Link to="/register" style={{ color: '#ff6b00', fontWeight: 'bold', textDecoration: 'none' }}>Create a fresh account</Link>
                    </p>
                )}

                <p className="back-link" onClick={() => navigate('/')} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '10px' }}>← Back</p>
            </div>
        </div>
    );
}

export default Login;