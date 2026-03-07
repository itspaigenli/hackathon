import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all survivors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM survivors");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching all survivors:", error);
    res.status(500).json({ error: "Failed to fetch all survivors" });
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

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching survivor:", error);
        res.status(500).json({ error: "Failed to fetch this survivor" });
    }
});

// CREATE a new survivor
router.post("/", async (req, res) => {
    const {
        firstname,
        lastname,
        age,
        skill,
        health_status,
        safehouse_id
    } = req.body;

    if (!firstname || !lastname) {
            return res.status(400).json({
                error: "firstname and lastname are required!"
            });
        }

    if(age < 0){
        return res.status(400).json({
            error: "Age must greater than 0!"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO survivors
            (firstname, lastname, age, skill, health_status, safehouse_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
        [firstname, lastname, age, skill, health_status, safehouse_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating survivor:", error);
        res.status(500).json({ error: "Failed to create survivor" });
    }
})

export default router;