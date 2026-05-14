import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Menu.css';

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { cart, addToCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/menu');
                setMenuItems(res.data || []);
            } catch (err) { console.error("Menu fetch error:", err); }
        };
        fetchMenu();
    }, []);

    // Helper to get item quantity
    const getItemQty = (id) => {
        if (!cart) return 0;
        const item = cart.find(i => i.id === id);
        return item ? item.quantity : 0;
    };

    // Safe Calculations using (cart || [])
    const safeCart = cart || [];
    const totalItemsCount = safeCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = safeCart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="menu-page-wrapper">
            <header className="premium-header">
                <div className="header-content">
                    <div className="brand">
                        <h1>Smart<span>Canteen</span></h1>
                        <p>Fuel your day with fresh food</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Search cravings..." onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="cart-trigger" onClick={() => navigate('/cart')}>
                            <ShoppingBag size={24} />
                            {totalItemsCount > 0 && <span className="badge">{totalItemsCount}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="menu-container">
                <div className="menu-grid">
                    {filteredItems.map((item) => {
                        const qty = getItemQty(item.id);
                        return (
                            <div className="food-card-v2" key={item.id}>
                                <div className="image-container">
                                    <img src={item.image || 'https://via.placeholder.com/300'} alt={item.name} />
                                    <div className="price-tag">₹{item.price}</div>
                                </div>
                                <div className="content">
                                    <div className="meta">
                                        <span className="category">General</span>
                                        <div className="rating"><Star size={12} fill="#fbbf24" color="#fbbf24"/> 4.2</div>
                                    </div>
                                    <h3>{item.name}</h3>
                                    <p className="desc">{item.description || 'Delicious freshly prepared meal.'}</p>
                                    <div className="card-footer">
                                        {qty === 0 ? (
                                            <button className="add-initial-btn" onClick={() => addToCart(item)}>ADD TO CART</button>
                                        ) : (
                                            <div className="quantity-selector">
                                                <button onClick={() => updateQuantity(item.id, qty - 1)}><Minus size={16}/></button>
                                                <span>{qty}</span>
                                                <button onClick={() => updateQuantity(item.id, qty + 1)}><Plus size={16}/></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {totalItemsCount > 0 && (
                <div className="floating-checkout" onClick={() => navigate('/cart')}>
                    <div className="info">
                        <p>{totalItemsCount} Item{totalItemsCount > 1 ? 's' : ''} Added</p>
                        <span>Total: ₹{totalPrice}</span>
                    </div>
                    <button className="checkout-btn">View Cart & Pay</button>
                </div>
            )}
        </div>
    );
}

export default Menu;