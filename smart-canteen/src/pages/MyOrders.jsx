import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { Package, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Styles/MyOrder.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) navigate('/login');
    fetchMyOrders();
    const interval = setInterval(fetchMyOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/my-orders/${user.id}`);
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="student-orders-wrapper">
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate('/menu')}><ArrowLeft size={18} /> Back</button>
        <h2 className="page-title"><Package size={22}/> My Food Status</h2>
      </div>

      <div className="student-orders-list">
        {orders.map((order) => {
          const isDone = order.status === 'Completed';
          return (
            <div key={order.id} className={`compact-order-card ${isDone ? 'done-card' : ''}`}>
              <div className="card-header">
                <strong>Order #{order.id}</strong>
                <span className={`status-pill ${order.status}`}>{order.status}</span>
              </div>

              {!isDone && (
                <div className="mini-tracker">
                  <div className={`step ${order.status !== 'Pending' ? 'on' : 'now'}`}>Placed</div>
                  <div className={`step ${['Ready', 'Completed'].includes(order.status) ? 'on' : order.status === 'Preparing' ? 'now' : ''}`}>
                    Prep {order.status === 'Preparing' && <span>({order.estimated_time})</span>}
                  </div>
                  <div className={`step ${order.status === 'Ready' ? 'now' : ''}`}>Ready</div>
                </div>
              )}

              <div className="qr-container">
                {!isDone ? (
                  <div className="qr-wrapper">
                    <QRCode value={order.id.toString()} size={140} fgColor="#2d3436" />
                    <p className="qr-text">Scan at counter to collect</p>
                  </div>
                ) : (
                  <div className="order-done">
                    <CheckCircle size={28} color="#027a6b" /> 
                    <span>Order Collected & Enjoyed!</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;