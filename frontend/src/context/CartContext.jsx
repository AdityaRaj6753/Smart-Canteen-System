import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            setCart(prev => prev.filter(item => item.id !== id));
        } else {
            setCart(prev =>
                prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
            );
        }
    };

    const clearCart = () => setCart([]);

    // Hamesha cart ki value verify karke bhejo
    return (
        <CartContext.Provider value={{ cart: cart || [], addToCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    // Agar context undefined hai toh fallback return karo
    if (!context) {
        return { cart: [], addToCart: () => {}, updateQuantity: () => {}, clearCart: () => {} };
    }
    return context;
};