import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, ShieldCheck, Building, Key, Edit3, Save, X, LogOut } from 'lucide-react'

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // 1. Browser se current logged-in user nikalo
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    } else {
      navigate('/login'); // Agar login nahi hai, toh bhaga do
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user.id}`, formData);
      if (res.data.success) {
        alert("✅ Profile Updated!");
        // LocalStorage mein naya data save karo
        localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
        setUser({ ...user, ...formData });
        setIsEditing(false);
      }
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // 🧹 Purana data saaf karo
    alert("👋 Logged out successfully!");
    navigate('/login');
    window.location.reload(); // Page refresh taaki navbar update ho jaye
  };

  if (!user) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            <User size={40} color="#e17055" />
          </div>
          <div>
            <h2 style={{margin:0, color:'#2d3436'}}>{user.name}</h2>
            <span style={styles.badge}>{user.role.toUpperCase()}</span>
          </div>
        </div>

        {/* 📝 FORM DETAILS */}
        <div style={styles.formGrid}>
          
          {/* Email (Lock - Hamesha ReadOnly) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}><Mail size={14}/> Email Address (Locked)</label>
            <input type="text" value={user.email} disabled style={styles.inputDisabled} />
          </div>

          {/* Unique ID (Lock - Hamesha ReadOnly) */}
          {user.role === 'admin' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}><Key size={14}/> Admin Unique ID (Locked)</label>
              <input type="text" value={user.employee_id || 'N/A'} disabled style={{...styles.inputDisabled, border:'1px solid #ff6b6b', color:'#d63031', fontWeight:'bold'}} />
            </div>
          )}

          {/* Name (Editable) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}><User size={14}/> Full Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} disabled={!isEditing} style={isEditing ? styles.inputActive : styles.inputDisabled} />
          </div>

          {/* Phone (Editable) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}><Phone size={14}/> Phone Number</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} disabled={!isEditing} style={isEditing ? styles.inputActive : styles.inputDisabled} />
          </div>

          {/* University/Canteen Name (Editable ONLY for Admin) */}
          {user.role === 'admin' && (
             <div style={styles.inputGroup}>
               <label style={styles.label}><Building size={14}/> Canteen/University Name</label>
               <input type="text" name="university_name" value={formData.university_name || ''} onChange={handleChange} disabled={!isEditing} style={isEditing ? styles.inputActive : styles.inputDisabled} />
             </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.actionRow}>
          {isEditing ? (
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={handleSave} style={styles.btnSave}><Save size={16}/> Save</button>
              <button onClick={() => {setIsEditing(false); setFormData(user);}} style={styles.btnCancel}><X size={16}/> Cancel</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} style={styles.btnEdit}><Edit3 size={16}/> Edit Profile</button>
          )}

          <button onClick={handleLogout} style={styles.btnLogout}><LogOut size={16}/> Logout</button>
        </div>

      </div>
    </div>
  )
}

// 🎨 STYLES
const styles = {
  container: { minHeight: '100vh', background: '#fff0e6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily:'sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px' },
  
  header: { display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: '#ffeaa7', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  badge: { background: '#00b894', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
  
  formGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: '#636e72', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },
  
  inputDisabled: { padding: '12px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#636e72', cursor: 'not-allowed', fontSize: '15px' },
  inputActive: { padding: '12px', borderRadius: '8px', border: '1px solid #e17055', background: 'white', color: '#2d3436', outline: 'none', fontSize: '15px', boxShadow: '0 0 5px rgba(225, 112, 85, 0.2)' },
  
  actionRow: { display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' },
  btnEdit: { background: '#0984e3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' },
  btnSave: { background: '#00b894', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' },
  btnCancel: { background: '#636e72', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' },
  btnLogout: { background: '#ff6b6b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' }
}

export default Profile