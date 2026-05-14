const mysql = require('mysql2');

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aditya2022@', // <--- Agar password hai toh yahan daalna
  database: 'smart_canteen'
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connect nahi hua!", err);
    process.exit(1);
  }
  console.log("✅ Database Connected...");

  // 1. Purani Users Table Uda Do
  const dropQuery = "DROP TABLE IF EXISTS users";
  db.query(dropQuery, (err) => {
    if (err) throw err;
    console.log("🗑️ Purani Users Table Delete ho gayi...");

    // 2. Nayi Table Banao (Phone, Branch, Year ke saath)
    const createQuery = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        phone VARCHAR(20),
        branch VARCHAR(50),
        year VARCHAR(20)
      )
    `;

    db.query(createQuery, (err) => {
      if (err) throw err;
      console.log("✨ Nayi Users Table Ban Gayi! ✅");

      // 3. Admin wapas banao (Kyunki wo delete ho gaya tha)
      const adminQuery = `
        INSERT INTO users (name, email, password, phone, branch, year) 
        VALUES ('Admin', 'admin123@gmail.com', '12345', '9999999999', 'Admin', 'N/A')
      `;

      db.query(adminQuery, (err) => {
        if (err) throw err;
        console.log("👤 Admin User Restore ho gaya! (admin123@gmail.com / 12345)");
        console.log("👉 Ab tum server restart karke Register try karo!");
        process.exit();
      });
    });
  });
});