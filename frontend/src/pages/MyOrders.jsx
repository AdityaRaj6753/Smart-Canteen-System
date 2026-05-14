import React from 'react';
import QRCode from 'react-qr-code'; // Ensure this is installed
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../Styles/MyOrders.css";

function MyOrders() {
    const navigate = useNavigate();
    
    // Dummy Order ID (Real apps mein ye backend se aayega)
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="orders-container">
            <button onClick={() => navigate('/menu')} className="back-to-menu">
                <ArrowLeft size={18} /> Back to Menu
            </button>

            <div className="order-card">
                <div className="success-icon">
                    <CheckCircle size={60} color="#4bb543" />
                </div>
                <h2>Order Placed Successfully!</h2>
                <p className="order-id-text">Order ID: <strong>{orderId}</strong></p>
                
                <div className="qr-section">
                    <p>Show this QR at the counter to collect your food</p>
                    <div className="qr-wrapper">
                        <QRCode value={orderId} size={180} />
                    </div>
                </div>

                <div className="status-badge">
                    Status: <span className="preparing">Preparing Your Meal...</span>
                </div>

                <button className="download-receipt" onClick={() => window.print()}>
                    Download Receipt
                </button>
            </div>
        </div>
    );
}

export default MyOrders;