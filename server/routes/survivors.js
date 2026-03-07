import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all survivors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM survivors");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;