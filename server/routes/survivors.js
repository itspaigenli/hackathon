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

// Get each survivor by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM survivors WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Survivor not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;