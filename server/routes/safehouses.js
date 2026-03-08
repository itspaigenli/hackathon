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

// GET one safehouse by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM safehouses WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Safehouse not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch safehouse" });
  }
});

export default router;
// GET survivor in a safe house
router.get('/:id/survivors', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query (
            `SELECT * FROM survivors
             WHERE safehouse_id = $1
             ORDER BY id ASC`,
             [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Survivor not found" });
        }

        res.status(200).json({
            safehouse_id: id,
            count: result.rows.length,
            survivors: result.rows
        });

    } catch (error) {
        console.error("Error fetching survivors for safehouse:", error);
        res.status(500).json({ error: "Failed to fetch survivors" });
    }
})

// GET supplies in a safe house
router.get('/:id/supplies', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query (
            `SELECT * FROM supplies
             WHERE safehouse_id = $1
             ORDER BY id ASC`,
             [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Supplies not found" });
        }

        res.status(200).json(result.rows);
        
    } catch (error) {
        console.error("Error fetching supplies for safehouse:", error);
        res.status(500).json({ error: "Failed to fetch supplies" });
    }
})

export default router;
