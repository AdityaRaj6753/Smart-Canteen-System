import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Context Provider Import ---
import { CartProvider } from "./context/CartContext";

// --- Pages Import (Sirf wahi jo exist karte hain) ---
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders"; 
import Admin from "./pages/Admin";
import AdminMenu from "./pages/AdminMenu";
import Orders from "./pages/Orders";
import AdminScanner from "./pages/AdminScanner";
import Analytics from "./pages/Analytics";
import ManageCanteen from './pages/ManageCanteen';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* --- Landing & Auth --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- 🎓 Student Flow --- */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* ✅ FIXED: Agar student payment ke baad /order-success par jaye, 
              toh usey seedha MyOrders (QR Page) par bhej do */}
          <Route path="/order-success" element={<Navigate to="/my-orders" />} /> 

          {/* --- 🛡️ Admin Routes (Same as before) --- */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/scan-qr" element={<AdminScanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/manage-canteen" element={<ManageCanteen />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;