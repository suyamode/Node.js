require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;
const connector = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
connector.connect((err) => {
  if (err) {
    console.log("Failed to connect");
  } else console.log("Connection established with the database!");
});
// const tables=[
//     "CREATE TABLE IF NOT EXISTS PRODUCTS"
// ]