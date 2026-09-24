const express = require("express");
require("dotenv").config();
const db = require("./db");
const productsRouter = require("../routes/products");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json);
app.use(cors());
app.use("/api/products", productsRouter);
app.listen(PORT, () => {
  console.log(`Server started listening to http://localhost:${PORT}`);
});
