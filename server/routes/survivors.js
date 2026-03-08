import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all survivors
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM survivors");
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching all survivors:", error);
//     res.status(500).json({ error: "Failed to fetch all survivors" });
//   }
// });

// Filtering by health/skill/safehouse_id
router.get('/', async (req, res) => {
    const { health_status, skill, safehouse_id } = req.query;

    const params = [];
    const where = [];

    if (health_status) {
        params.push(health_status);
        where.push(`health_status = $${params.length}`);
    }

    if (skill) {
        params.push(skill);
        where.push(`skill = $${params.length}`);
    }

    if (safehouse_id) {
        params.push(safehouse_id);
        where.push(`safehouse_id = $${params.length}`);
    }
    console.log(req.query);
    console.log("With Params:", params);

    try{
        const result = await pool.query(
        `
            SELECT * FROM survivors
            ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
            ORDER BY id ASC
        `,
        params
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching survivors:", error);
        res.status(500).json({ error: "Failed to fetch survivors" });
    }
})

// Get each survivor by id
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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

    if(age === undefined || age < 0){
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

// UPDATE a survivor
router.put('/:id', async (req, res) => {
    const { id } = req.params;

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

    if(age === undefined || age < 0){
        return res.status(400).json({
            error: "Age must greater than 0!"
        });
    }

    try{
        const result = await pool.query(
            `UPDATE survivors
            SET firstname = $1,
                lastname = $2,
                age = $3,
                skill = $4,
                health_status = $5,
                safehouse_id = $6
            WHERE id = $7
            RETURNING *`,
            [firstname, lastname, age, skill, health_status, safehouse_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Survivor not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating survivor:", error);
        res.status(500).json({ error: "Failed to update survivor" });
    }
})

// DELETE a survivor
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM survivors WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Survivor not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error deleting survivor:", error);
        res.status(500).json({ error: "Failed to delete survivor" });
    }
})

export default router;