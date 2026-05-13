import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner'; 
import axios from 'axios';
import { User, CreditCard, Utensils, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Scanner.css'; // Path fixed

function AdminScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (text) => {
    if (!text || loading) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/scan-order', { qrText: text });
      if (res.data.success) {
        setScannedData(res.data.order);
        setShowModal(true);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Scan Error!");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${scannedData.id}/status`, { 
        status: 'Completed' 
      });
      alert("✅ Order Delivered!");
      setShowModal(false);
      setScannedData(null);
    } catch (err) {
      alert("Failed to complete order");
    }
  };

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Back</button>
        <h2>Scan QR</h2>
      </div>

      <div className="scanner-wrapper">
        <Scanner onScan={(result) => handleScan(result[0]?.rawValue)} />
      </div>

      {showModal && scannedData && (
        <div className="scan-modal-overlay">
          <div className="scan-result-card">
            <div className="scan-card-header">
              <h3>Verify Order</h3>
              <button onClick={() => setShowModal(false)}><XCircle /></button>
            </div>
            <div className="scan-info-body">
              <p><User size={16}/> <b>Name:</b> {scannedData.user_name}</p>
              <p><CreditCard size={16}/> <b>Payment:</b> 
                 <span className={scannedData.payment_method === 'Counter' ? 'unpaid' : 'paid'}>
                    {scannedData.payment_method === 'Counter' ? ' CASH PENDING' : ' PAID ✅'}
                 </span>
              </p>
              <div className="scan-items">
                {scannedData.items.map((item, i) => <div key={i}>{item.qty}x {item.name}</div>)}
              </div>
              <h3 className="scan-total">Total: ₹{scannedData.total_amount}</h3>
            </div>
            <button onClick={confirmDelivery} className="confirm-btn">
              <CheckCircle size={18} /> Confirm & Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminScanner;