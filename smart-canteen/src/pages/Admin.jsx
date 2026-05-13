import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, ClipboardList, QrCode, LogOut, TrendingUp } from 'lucide-react';
import '../Styles/Admin.css';

function Admin() {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser || savedUser.role !== 'admin') {
            navigate('/');
        } else {
            setAdminUser(savedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!adminUser) return null;

    return (
        <div className="admin-dashboard-wrapper">
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <h2>Smart<span>Canteen</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active" onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={20}/> Dashboard
                    </div>
                    {/* Changed path to /manage-canteen */}
                    <div className="nav-item" onClick={() => navigate('/manage-canteen')}>
                        <Utensils size={20}/> Manage Menu
                    </div>
                    <div className="nav-item" onClick={() => navigate('/orders')}>
                        <ClipboardList size={20}/> Live Orders
                    </div>
                    <div className="nav-item" onClick={() => navigate('/analytics')}>
                        <TrendingUp size={20}/> Business Insights
                    </div>
                    <div className="nav-item" onClick={() => navigate('/scan-qr')}>
                        <QrCode size={20}/> Scan QR
                    </div>
                </nav>
                <div className="sidebar-footer" onClick={handleLogout}>
                    <LogOut size={20}/> Logout
                </div>
            </aside>

            <main className="admin-main-content">
                <header className="admin-top-bar">
                    {/* Displaying 'Admin' as per your requirement */}
                    <h3>Welcome back, Admin 👋</h3>
                </header>

                <div className="admin-stats-grid">
                    {/* Card 1: Linked to Manage Canteen */}
                    <div className="stat-card orange" onClick={() => navigate('/manage-canteen')}>
                        <div className="stat-info">
                            <h3>Menu Items</h3>
                            <p>Manage stock & trends</p>
                        </div>
                        <Utensils size={40} className="stat-icon" />
                    </div>

                    <div className="stat-card blue" onClick={() => navigate('/orders')}>
                        <div className="stat-info">
                            <h3>Kitchen</h3>
                            <p>Live order status</p>
                        </div>
                        <ClipboardList size={40} className="stat-icon" />
                    </div>

                    <div className="stat-card green" onClick={() => navigate('/analytics')}>
                        <div className="stat-info">
                            <h3>Insights</h3>
                            <p>Sales & growth</p>
                        </div>
                        <TrendingUp size={40} className="stat-icon" />
                    </div>

                    <div className="stat-card purple" onClick={() => navigate('/scan-qr')}>
                        <div className="stat-info">
                            <h3>QR Scanner</h3>
                            <p>Verify orders</p>
                        </div>
                        <QrCode size={40} className="stat-icon" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Admin;