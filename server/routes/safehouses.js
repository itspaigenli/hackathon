import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all safehouses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM safehouses ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch safehouses" });
  }
});
