require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Apply Middleware AFTER app initialization
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Connection config with multipleStatements enabled
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
    console.log("Connected to MySQL database successfully!");
  }
});

// Route to create tables on demand
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

// Serve the index.html form on root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Updated POST route matching the /addiphones URL requirement
app.post("/addiphones", (req, res) => {
  const { product_name, product_url } = req.body;

  if (!product_name || !product_url) {
    return res
      .status(400)
      .send("Please provide both Product Name and Product URL.");
  }

  const insertQuery = `
    INSERT INTO Products (product_name, product_url)
    VALUES (?, ?);
  `;

  connector.query(insertQuery, [product_name, product_url], (err, result) => {
    if (err) {
      console.error("Error inserting data into Products table:", err.message);
      return res.status(500).send("Database Insertion Error: " + err.message);
    }

    console.log(`Product inserted successfully with ID: ${result.insertId}`);
    res.send(`
      <h2>Product Added Successfully!</h2>
      <p><strong>Product ID:</strong> ${result.insertId}</p>
      <p><strong>Name:</strong> ${product_name}</p>
      <p><strong>URL Slug:</strong> ${product_url}</p>
      <br>
      <a href="/">Add Another Product</a>
    `);
  });
});

app.listen(PORT, () => {
  console.log(`Server started listening at http://localhost:${PORT}`);
});
