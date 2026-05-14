import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Payment from "./pages/Payment"; 
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<Navigate to="/my-orders" />} /> 
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/scan-qr" element={<AdminScanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/manage-canteen" element={<ManageCanteen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;