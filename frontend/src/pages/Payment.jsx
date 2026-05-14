import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Smartphone, ArrowLeft } from 'lucide-react';
import '../Styles/Payment.css';

function Payment() {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState('');

    const handlePay = () => {
        if (!selectedMode) return alert("Please select a payment mode!");
        // Simulate Payment Processing
        alert(`Processing payment via ${selectedMode}...`);
        navigate('/my-orders'); // Success ke baad QR page pe bhej do
    };

    return (
        <div className="payment-container">
            <button onClick={() => navigate('/cart')} className="back-btn"><ArrowLeft size={18}/> Back to Cart</button>
            <div className="payment-card">
                <h1 className="premium-text">Select Payment Mode</h1>
                <div className="modes-list">
                    <div className={`mode-item ${selectedMode === 'UPI' ? 'active' : ''}`} onClick={() => setSelectedMode('UPI')}>
                        <Smartphone color="#6c5ce7" /> <span>UPI (GPay/PhonePe)</span>
                    </div>
                    <div className={`mode-item ${selectedMode === 'Card' ? 'active' : ''}`} onClick={() => setSelectedMode('Card')}>
                        <CreditCard color="#0984e3" /> <span>Credit / Debit Card</span>
                    </div>
                    <div className={`mode-item ${selectedMode === 'Wallet' ? 'active' : ''}`} onClick={() => setSelectedMode('Wallet')}>
                        <Wallet color="#00b894" /> <span>Canteen Wallet</span>
                    </div>
                </div>
                <button className="confirm-pay-btn" onClick={handlePay}>Confirm & Pay</button>
            </div>
        </div>
    );
}
export default Payment;