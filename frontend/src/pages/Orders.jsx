import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, CheckCircle, Flame, Truck } from 'lucide-react';
import "../Styles/Order.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) { console.log("Fetch Error"); }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status, estimated_time: "10m" });
    fetchOrders();
  };

  return (
    <div className="kitchen-wrapper">
      <div className="kitchen-header">
        <h1>👨‍🍳 Live Kitchen Display</h1>
        <div className="stats-bar">
          <span>Active: {orders.filter(o => o.status !== "Completed").length}</span>
        </div>
      </div>

      <div className="kitchen-grid">
        {orders.filter(o => o.status !== "Completed").map(order => (
          <div key={order.id} className={`order-ticket ${order.status}`}>
            <div className="ticket-header">
              <span className="order-no">#{order.id}</span>
              <span className="order-time"><Clock size={14}/> {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            <div className="customer-name">{order.user_name || "Student"}</div>
            
            <div className="order-items-list">
               {/* Agar items JSON string mein hain toh parse karna padega */}
               <p className="item-text">{order.items}</p> 
            </div>

            <div className="ticket-footer">
               <div className="status-label">Status: <b>{order.status}</b></div>
               <div className="action-buttons">
                  {order.status === "Pending" && (
                    <button className="btn-prep" onClick={() => updateStatus(order.id, "Preparing")}>
                      <Flame size={16}/> Start Cooking
                    </button>
                  )}
                  {order.status === "Preparing" && (
                    <button className="btn-ready" onClick={() => updateStatus(order.id, "Ready")}>
                      <CheckCircle size={16}/> Mark Ready
                    </button>
                  )}
                  {order.status === "Ready" && (
                    <button className="btn-done" onClick={() => updateStatus(order.id, "Completed")}>
                      <Truck size={16}/> Delivered
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;