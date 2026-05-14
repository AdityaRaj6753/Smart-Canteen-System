import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, TrendingUp, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import '../Styles/ManageCanteen.css';

function ManageCanteen() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [stats, setStats] = useState({ itemPerformance: [] });
    const [imagePreview, setImagePreview] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', stock_quantity: '', description: '', image: '' });

    const fetchData = useCallback(async () => {
        try {
            const menuRes = await axios.get('http://localhost:5000/api/menu');
            const statsRes = await axios.get('http://localhost:5000/api/analysis/stats');
            setMenu(menuRes.data);
            setStats({ itemPerformance: statsRes.data.itemPerformance || [] });
        } catch (err) {
            console.error("Data Fetch Error:", err);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewItem({ ...newItem, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // 🔥 Updated handleAddItem: Backend se unique ID mangwa ke register karna
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            // Step 1: Backend se next unique Product ID mangao
            const idRes = await axios.get('http://localhost:5000/api/menu/next-id');
            const nextPID = idRes.data.nextId;

            // Step 2: Fresh ID ke saath data submit karo
            const productData = { ...newItem, product_id: nextPID, category: 'General' };
            
            await axios.post('http://localhost:5000/api/menu', productData);
            
            setNewItem({ name: '', price: '', stock_quantity: '', description: '', image: '' });
            setImagePreview(null);
            alert(`Product Registered Successfully with ID: ${nextPID}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Registration failed. Duplicate ID or Image too large.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/menu/${id}`);
                fetchData();
            } catch (err) { alert("Delete failed."); }
        }
    };

    const handleStockUpdate = async (id, newStock) => {
        try {
            await axios.put(`http://localhost:5000/api/menu/stock/${id}`, { stock: newStock });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const topItem = stats.itemPerformance.length > 0 ? stats.itemPerformance[0] : null;

    return (
        <div className="manage-page-bg">
            <div className="manage-container-v2">
                <div className="header-flex">
                    <button className="back-link" onClick={() => navigate('/admin')}><ArrowLeft size={18}/> Back</button>
                    <h2>🥣 Smart Inventory Manager</h2>
                </div>

                {topItem && (
                    <div className="trending-float-card">
                        <div className="badge-v2"><TrendingUp size={14}/> HIGH DEMAND</div>
                        <p><strong>{topItem.item_name}</strong> is trending! (Sold: {topItem.orderCount})</p>
                    </div>
                )}

                <div className="add-item-section-v2">
                    <form onSubmit={handleAddItem} className="grid-form">
                        <input type="text" placeholder="Item Name" name="name" value={newItem.name} required onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
                        <input type="number" placeholder="Price (₹)" name="price" value={newItem.price} required onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
                        <input type="number" placeholder="Initial Stock" name="stock" value={newItem.stock_quantity} required onChange={(e) => setNewItem({...newItem, stock_quantity: e.target.value})} />
                        
                        <div className="file-input-wrapper" onClick={() => document.getElementById('img-up').click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="form-img-preview" />
                            ) : (
                                <><ImageIcon size={18}/> Click to Upload Product Image</>
                            )}
                            <input type="file" id="img-up" hidden accept="image/*" onChange={handleImageChange} />
                        </div>

                        <textarea placeholder="Description..." name="desc" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
                        <button type="submit" className="orange-submit-btn">Register Product & Add to Menu</button>
                    </form>
                </div>

                <div className="table-wrapper-v2">
                    <table className="custom-table-v2">
                        <thead className="orange-head">
                            <tr>
                                <th>Product ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Stock Status</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map((item) => (
                                <tr key={item.id}>
                                    <td><span className="pid-text">{item.product_id}</span></td>
                                    <td>
                                        {item.image ? (
                                            <img src={item.image} alt="item" className="table-img-thumb" />
                                        ) : (
                                            <div className="no-img-placeholder">No Image</div>
                                        )}
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <div className="stock-edit-cell">
                                            <span className={item.stock_quantity <= 0 ? "out-of-stock" : "in-stock-text"}>
                                                {item.stock_quantity <= 0 ? "OUT OF STOCK" : `${item.stock_quantity} pcs`}
                                            </span>
                                            <input type="number" className="stock-mini-input" defaultValue={item.stock_quantity} onBlur={(e) => handleStockUpdate(item.id, e.target.value)} />
                                        </div>
                                    </td>
                                    <td>₹{item.price}</td>
                                    <td><button className="del-btn" onClick={() => handleDelete(item.id)}><Trash2 size={18}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageCanteen;