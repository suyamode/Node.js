const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./db");
const productsRouter = require("../routes/products");
const usersRouter = require("../routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Essential Middleware
app.use(express.json()); // Added () here!
app.use(cors());

// Mount Routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server started listening to http://localhost:${PORT}`);
});
