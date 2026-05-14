const mysql = require('mysql2');

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aditya2022@', // <-- Agar password hai toh yahan daalna
  database: 'smart_canteen'
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connect nahi hua!", err);
    process.exit(1);
  }
  console.log("✅ Database Connected...");

  // 1. Purani Table Uda Do
  const dropQuery = "DROP TABLE IF EXISTS orders";
  db.query(dropQuery, (err) => {
    if (err) throw err;
    console.log("🗑️ Purani Orders Table Delete ho gayi...");

    // 2. Nayi Table Banao (Status Column ke saath)
    const createQuery = `
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        items JSON,
        total_amount INT,
        user_id INT,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending'
      )
    `;

    db.query(createQuery, (err) => {
      if (err) throw err;
      console.log("✨ Nayi Table Ban Gayi! (Status column ke saath) ✅");
      console.log("👉 Ab tum 'setup_db.js' file delete kar sakte ho.");
      process.exit();
    });
  });
});