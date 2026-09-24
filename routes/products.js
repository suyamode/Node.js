const express = require("express");
const db = require("../scripts/db");
const router = express.Router();
router
  .route("/")
  .get(async (req, res) => {
    try {
      const [products] = await db.query("SELECT * FROM PRODUCTS");
      res.status(200).json(products);
    } catch (err) {
      console.log("Error fetching products: ", err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  })
  .post(async (req, res) => {
    const { seller_id, title, price, stock } = req.body;
    if (!seller_id || !title || !price) {
      return res
        .status(400)
        .json({ error: "Seller_id,title and price are required" });
    }
    try {
      const [result] = await db.query(
        "INSERT INTO PRODUCTS(seller_id,title,price,stock) VALUES (?,?,?,?)",
        [seller_id, title, price, stock || 1],
      );
      res.status(201).json({
        message: "Product inserted succesfully!",
        productId: result.insertId,
      });
    } catch (err) {
      console.log("Error Creating product");
      res.status(500).json({ error: "Failed to cerate the product" });
    }
  });
router.route("/:id").get(async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM PRODUCTS WHERE id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.log("Error fetching product");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});
module.exports = router;
