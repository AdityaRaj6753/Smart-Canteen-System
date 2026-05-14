import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DollarSign, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import '../Styles/Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- 🎨 Dynamic Color Generator ---
const getDynamicColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
};

function Analytics() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ revenue: 0, orders: 0, stockData: [], itemPerformance: [] });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/analysis/stats');
            setStats({
                revenue: res.data.revenue || 0,
                orders: res.data.orders || 0,
                stockData: res.data.stockData || [],
                itemPerformance: res.data.itemPerformance || []
            });
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        if (!rawUser) { navigate('/'); return; }
        const savedUser = JSON.parse(rawUser);
        if (savedUser && savedUser.role === 'admin') { fetchStats(); } 
        else { navigate('/'); }
    }, [navigate, fetchStats]);

    // --- 1. Stock Levels Data (Bar Chart) ---
    const stockChartData = {
        labels: stats.stockData.length > 0 ? stats.stockData.map(i => i.name) : ["No Items"],
        datasets: [{
            label: 'Current Stock (Qty)',
            data: stats.stockData.length > 0 ? stats.stockData.map(i => i.stock_quantity) : [0],
            backgroundColor: ['#ff6b00', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            borderRadius: 8
        }]
    };

    // --- 2. Top Revenue Data (Bar Chart) ---
    const revenueChartData = {
        labels: stats.itemPerformance.length > 0 ? stats.itemPerformance.map(i => i.item_name) : ["No Sales"],
        datasets: [{
            label: 'Revenue per Item (₹)',
            data: stats.itemPerformance.length > 0 ? stats.itemPerformance.map(i => i.itemRevenue) : [0],
            backgroundColor: stats.itemPerformance.map(i => getDynamicColor(i.item_name)),
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ffffff'
        }]
    };

    // --- 3. Sales Share Data (Pie Chart - NEW LOGIC) ---
    const salesSharePieData = {
        labels: stats.itemPerformance.length > 0 ? stats.itemPerformance.map(i => i.item_name) : ["No Orders"],
        datasets: [{
            label: 'Total Orders',
            data: stats.itemPerformance.length > 0 ? stats.itemPerformance.map(i => i.orderCount) : [0],
            backgroundColor: stats.itemPerformance.map(i => getDynamicColor(i.item_name)),
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'bottom' } }
    };

    if (loading) return <div className="loading-screen">Analyzing Business Data...</div>;

    return (
        <div className="analytics-page">
            <div className="analytics-nav-header">
                <button className="back-btn" onClick={() => navigate('/admin')}>
                    <ArrowLeft size={20}/> Back to Dashboard
                </button>
                <h2>📊 Live Business Analytics</h2>
            </div>

            <div className="stats-row">
                <div className="stat-card-premium">
                    <div className="icon-circle orange"><DollarSign size={24}/></div>
                    <div className="text">
                        <span>Total Revenue</span>
                        <h3>₹{stats.revenue}</h3>
                    </div>
                </div>
                <div className="stat-card-premium">
                    <div className="icon-circle blue"><ShoppingBag size={24}/></div>
                    <div className="text">
                        <span>Total Orders (Paid)</span>
                        <h3>{stats.orders}</h3>
                    </div>
                </div>
            </div>

            {stats.stockData.length === 0 && stats.itemPerformance.length === 0 ? (
                <div className="no-data-alert-box">
                    <AlertCircle size={50} color="#ccc" />
                    <h3>No Business Activity Recorded</h3>
                </div>
            ) : (
                <div className="charts-main-grid">
                    {/* Graph 1: Revenue */}
                    <div className="chart-item-container">
                        <h3>Top Revenue Generating Items (Earnings)</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={revenueChartData} options={options} />
                        </div>
                    </div>

                    {/* Graph 2: Inventory */}
                    <div className="chart-item-container">
                        <h3>Current Stock Levels (Inventory)</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stockChartData} options={options} />
                        </div>
                    </div>

                    {/* Graph 3: Popularity (NEW) */}
                    <div className="chart-item-container">
                        <h3>Sales Share Distribution (Popularity %)</h3>
                        <div className="pie-wrapper" style={{ height: '300px' }}>
                            <Pie 
                                data={salesSharePieData} 
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'right' } }
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;