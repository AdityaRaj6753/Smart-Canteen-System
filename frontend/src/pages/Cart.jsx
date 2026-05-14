import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import '../Styles/Cart.css';

function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const safeCart = cart || [];
    const total = safeCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (safeCart.length === 0) return alert("Your cart is empty!");
        // ✅ Pehle Payment page par bhej rahe hain
        navigate('/payment'); 
    };

    if (safeCart.length === 0) {
        return (
            <div className="empty-cart-container">
                <ShoppingBag size={80} color="#ccc" />
                <h2>Your cart is empty</h2>
                <p>Add some delicious food from the menu!</p>
                <button onClick={() => navigate('/menu')} className="go-back-btn">
                    Go to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="cart-header">
                <button onClick={() => navigate('/menu')} className="back-btn">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1>My Plate ({safeCart.length})</h1>
            </div>

            <div className="cart-content">
                <div className="cart-items-list">
                    {safeCart.map((item) => (
                        <div key={item.id} className="cart-item-card">
                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>₹{item.price}</p>
                            </div>
                            <div className="qty-controls">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16}/></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button>
                            </div>
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary-card">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                    </div>
                    <div className="summary-row">
                        <span>GST (0%)</span>
                        <span>₹0</span>
                    </div>
                    <div className="summary-total">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                    </div>
                    <button className="checkout-main-btn" onClick={handleCheckout}>
                        Pay & Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;