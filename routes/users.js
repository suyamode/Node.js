const express = require("express");
const db = require("../scripts/db");
const router = express.Router();

// POST /api/users -> Create a user
router.post("/", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );

    res.status(201).json({
      message: "User created successfully!",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
