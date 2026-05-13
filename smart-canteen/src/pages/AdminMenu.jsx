import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from 'lucide-react';
import "../Styles/AdminMenu.css";

function AdminMenu() {
    const [menu, setMenu] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "", category: "Fast Food", image: "", description: "", stock_quantity: 0 });

    const fetchMenu = async () => {
        const res = await axios.get("http://localhost:5000/api/menu");
        setMenu(res.data);
    };

    useEffect(() => { fetchMenu(); }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setNewItem({ ...newItem, image: reader.result });
        if (file) reader.readAsDataURL(file);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/menu", newItem);
            alert("Item Added!");
            setNewItem({ name: "", price: "", category: "Fast Food", image: "", description: "", stock_quantity: 0 });
            fetchMenu();
        } catch (err) { alert("Error adding item"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this item?")) {
            await axios.delete(`http://localhost:5000/api/menu/${id}`);
            fetchMenu();
        }
    };

    return (
        <div className="admin-menu-page">
            <div className="admin-menu-card">
                <h2>🍱 Manage Canteen Menu</h2>
                <form className="add-item-form-premium" onSubmit={handleAdd}>
                    <div className="form-grid">
                        <input type="text" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                        <input type="number" placeholder="Price (₹)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                        <input type="number" placeholder="Initial Stock" value={newItem.stock_quantity} onChange={e => setNewItem({...newItem, stock_quantity: e.target.value})} required />
                    </div>
                    <textarea placeholder="Description..." value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                    <button type="submit" className="add-btn-premium">Add Item</button>
                </form>

                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Stock Left</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map(item => (
                            <tr key={item.id}>
                                <td><img src={item.image} className="table-img" alt="" /></td>
                                <td>{item.name}</td>
                                <td style={{color: item.stock_quantity < 10 ? 'red' : 'green', fontWeight: 'bold'}}>
                                    {item.stock_quantity} pcs
                                </td>
                                <td>₹{item.price}</td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)} className="delete-btn-icon"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminMenu;