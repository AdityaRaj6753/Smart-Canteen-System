require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// --- Database Connection ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.log('❌ DB Connection Error. Check your .env file or XAMPP.');
    else console.log('✅ MySQL Connected Securely');
});

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

let tempAdminOTP = null;

// --- 🔐 AUTHENTICATION ROUTES ---

// 1. Admin Send OTP
app.post('/api/admin/send-otp', async (req, res) => {
    const { email } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Access Denied: Unauthorized Email Address" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempAdminOTP = otp; 
    console.log("🔑 Admin OTP Generated:", otp);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Smart Canteen Admin Login OTP',
        text: `Your OTP for Admin Access is: ${otp}.`
    };
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP email" });
    }
});

// 2. Admin Verify Login
app.post('/api/admin/verify-login', (req, res) => {
    const { email, otp } = req.body;
    if (email === process.env.ADMIN_EMAIL && otp === tempAdminOTP) {
        tempAdminOTP = null; 
        res.json({ 
            success: true, 
            user: { role: 'admin', email: email, name: 'Admin' } 
        });
    } else {
        res.status(401).json({ message: "Invalid OTP or Email" });
    }
});

// 3. Student Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Database se user dhundo jiska email, password aur role student ho
    db.query("SELECT * FROM users WHERE email = ? AND password = ? AND role = 'student'", [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password!" });
        }
    });
});
// 4. 🔥 NEW: Student Registration (Fresh Data Entry)
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Register Error:", err);
            return res.status(500).json({ success: false, message: "Email already exists or Database error." });
        }
        res.json({ success: true, message: "Student Registered Successfully! Please Login." });
    });
});

// --- 🍱 MENU & INVENTORY ROUTES ---

app.get('/api/menu/next-id', (req, res) => {
    db.query("SELECT MAX(id) as lastId FROM menu", (err, result) => {
        if (err) return res.status(500).json(err);
        const nextId = (result[0].lastId || 0) + 1;
        const formattedId = `PRD-${String(nextId).padStart(3, '0')}`;
        res.json({ nextId: formattedId });
    });
});

app.get('/api/menu', (req, res) => {
    db.query("SELECT * FROM menu WHERE is_active = 1", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/menu', (req, res) => {
    const { name, price, category, image, description, stock_quantity, product_id } = req.body;
    const sql = "INSERT INTO menu (name, price, category, image, description, stock_quantity, product_id, is_active, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)";
    db.query(sql, [name, price, category, image, description, stock_quantity, product_id], (err) => {
        if (err) {
            console.error("Insert Error:", err);
            return res.status(500).json({ error: "Duplicate Product ID or DB Error." });
        }
        res.json({ success: true, message: "Product Registered Successfully" });
    });
});

app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE menu SET is_active = 0 WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Item removed successfully" });
    });
});

app.put('/api/menu/stock/:id', (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    const sql = "UPDATE menu SET stock_quantity = ? WHERE id = ?";
    db.query(sql, [stock, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Stock levels updated successfully" });
    });
});

// --- 📈 BUSINESS ANALYTICS ROUTES ---

app.get('/api/analysis/stats', (req, res) => {
    const salesSql = "SELECT SUM(total_amount) as totalRevenue, COUNT(id) as totalOrders FROM orders WHERE payment_status = 'Paid'";
    const stockSql = "SELECT name, stock_quantity FROM menu WHERE is_active = 1";
    const itemStatsSql = `
        SELECT item_name, 
               COUNT(id) as orderCount, 
               SUM(total_amount) as itemRevenue 
        FROM orders 
        WHERE payment_status = 'Paid' AND item_name IS NOT NULL
        GROUP BY item_name 
        ORDER BY itemRevenue DESC`;

    db.query(salesSql, (err, salesRes) => {
        if (err) return res.status(500).json(err);
        db.query(stockSql, (err, stockRes) => {
            if (err) return res.status(500).json(err);
            db.query(itemStatsSql, (err, itemStatsRes) => {
                if (err) return res.status(500).json(err);
                res.json({
                    revenue: salesRes[0].totalRevenue || 0,
                    orders: salesRes[0].totalOrders || 0,
                    stockData: stockRes || [],
                    itemPerformance: itemStatsRes || [] 
                });
            });
        });
    });
});

app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));