import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Smartphone, Banknote, ShieldCheck } from 'lucide-react';

import '../Styles/Payment.css';

function Payment() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('Counter'); 
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔴 FIX 1: Guard sirf page load hone par check karega, order place hone ke baad nahi
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login', { replace: true });
    } else if (cart.length === 0) {
      navigate('/cart', { replace: true });
    } else {
      setUser(JSON.parse(storedUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- Yahan se 'cart' hata diya hai taaki loop na bane

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        user_id: user.id,
        user_name: user.name,
        items: JSON.stringify(cart),
        total_amount: getCartTotal(),
        payment_method: paymentMethod,
        status: 'Pending'
      };
        
      const res = await axios.post('http://localhost:5000/api/orders', orderData);
      
      // 🔴 FIX 2: Pehle Alert -> Phir Navigate -> Sabse last me Cart Clear
      if (res.data.success || res.status === 200 || res.status === 201) {
        alert(`🎉 Order Placed Successfully! Generating QR Code...`);
        navigate('/my-orders', { replace: true });
        
        // Thoda delay dekar cart clear karenge taaki navigation disturb na ho
        setTimeout(() => {
          clearCart();
        }, 500);
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      alert("Server Error! Check Console.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <ShieldCheck size={30} color="#027a6b" />
          <h2 style={{ margin: 0, color: '#2d3436' }}>Checkout</h2>
        </div>

        <div className="payment-amount-box">
          <p style={{ margin: '0 0 5px 0', color: '#636e72' }}>Total Amount</p>
          <h1 style={{ margin: 0, color: '#e17055' }}>₹{getCartTotal()}</h1>
        </div>

        <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>How would you like to pay?</h3>
        
        <div className="payment-options-container">
          <div 
            className="payment-option"
            style={{ border: paymentMethod === 'Counter' ? '2px solid #e17055' : '1px solid #dfe6e9' }}
            onClick={() => setPaymentMethod('Counter')}
          >
            <Banknote size={24} color={paymentMethod === 'Counter' ? '#e17055' : '#636e72'} />
            <div>
              <span className="payment-option-text">Pay at Counter</span>
              <p className="payment-option-subtext">Pay cash when receiving food</p>
            </div>
          </div>

          <div 
            className="payment-option"
            style={{ border: paymentMethod === 'Online' ? '2px solid #027a6b' : '1px solid #dfe6e9' }}
            onClick={() => setPaymentMethod('Online')}
          >
            <Smartphone size={24} color={paymentMethod === 'Online' ? '#027a6b' : '#636e72'} />
            <div>
              <span className="payment-option-text">Pay Online Now</span>
              <p className="payment-option-subtext">UPI, GPay, PhonePe</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleFinalPayment} 
          disabled={isProcessing}
          className="payment-btn"
          style={{ background: isProcessing ? '#b2bec3' : '#027a6b' }}
        >
          {isProcessing ? 'Processing...' : `Generate QR & Place Order`}
        </button>
      </div>
    </div>
  );
}

export default Payment;