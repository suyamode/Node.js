require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

const tables = [
  `CREATE TABLE IF NOT EXISTS Products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_url VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL
    );`,

  `CREATE TABLE IF NOT EXISTS ProductDescription (
        description_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        product_brief_description TEXT NOT NULL,
        product_description TEXT NOT NULL,
        product_img VARCHAR(255) NOT NULL,
        product_link VARCHAR(255) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
    );`,

  `CREATE TABLE IF NOT EXISTS ProductDetail (
        detail_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        product_page_url VARCHAR(255) NOT NULL,
        starting_price VARCHAR(50) NOT NULL,
        price_range VARCHAR(100) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
    );`,

  `CREATE TABLE IF NOT EXISTS User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        user_password VARCHAR(255) NOT NULL
    );`,

  `CREATE TABLE IF NOT EXISTS Orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
    );`,
];

// Connection pool/config with multipleStatements enabled
const connector = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// Verify connection on startup
connector.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Connected to MySQL database successfully.");
  }
});

app.get("/install", (req, res) => {
  const combinedQuery = tables.join("\n");

  connector.query(combinedQuery, (err, result) => {
    if (err) {
      console.error("Error while creating tables: ", err.message);
      return res
        .status(500)
        .send("Error while creating tables: " + err.message);
    }

    console.log("All tables created successfully!");
    res.send("<h1>All 5 tables created successfully!</h1>");
  });
});

app.listen(PORT, () => {
  console.log(`Server started listening at http://localhost:${PORT}`);
});
