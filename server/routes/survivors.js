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

/** 
 * @swagger 
 * /api/survivors:
 *    get:
 *      summary: Get all survivors.
 *      description: Returns all survivors, with optional filtering by health status, skill, and safehouse ID.
 *      tags: 
 *          - Survivors
 *      parameters:
 *       - in: query
 *         name: health_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [healthy, injured, infected]
 *         description: Filter survivors by health status
 *       - in: query
 *         name: skill
 *         required: false
 *         schema:
 *           type: string
 *           enum: [medic, scout, engineer, fighter, hunter]
 *         description: Filter survivors by skill
 *       - in: query
 *         name: safehouse_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter survivors by safehouse ID
 *      responses:
 *          200:
 *              description: A list of survivors
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  firstname:
 *                                      type: string
 *                                      example: Alice
 *                                  lastname:
 *                                      type: string
 *                                      example: Walker
 *                                  age:
 *                                      type: integer
 *                                      example: 29
 *                                  skill:
 *                                      type: string
 *                                      example: medic
 *                                  health_status:
 *                                      type: string
 *                                      example: healthy
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 2
 *          404:
 *              description: No survivors found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: integer
 *                                  example: 404
 *                              error:
 *                                  type: string
 *                                  example: Survivor not found
 *          500:
 *              description: Failed to fetch survivors
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: integer
 *                                      example: 505 
 *                                  error:
 *                                      type: string
 *                                      example: Failed to fetch survivors 
 * */
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

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Survivor not found" });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching survivors:", error);
        res.status(500).json({ error: "Failed to fetch survivors" });
    }
})

/** 
 * @swagger 
 * /api/survivors/{id}:
 *    get:
 *      summary: Get a survivor by ID.
 *      description: Returns the details of a specific survivor based on their ID.
 *      tags: 
 *          - Survivors
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the survivor.
 *      responses:
 *          200:
 *              description: Survivor found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  firstname:
 *                                      type: string
 *                                      example: Alice
 *                                  lastname:
 *                                      type: string
 *                                      example: Walker
 *                                  age:
 *                                      type: integer
 *                                      example: 29
 *                                  skill:
 *                                      type: string
 *                                      example: medic
 *                                  health_status:
 *                                      type: string
 *                                      example: healthy
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 2
 *          404:
 *              description: Survivor not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: integer
 *                                  example: 404
 *                              error:
 *                                  type: string
 *                                  example: Survivor not found
 *          500:
 *              description: Server error when retrieving survivor
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: integer
 *                                      example: 505 
 *                                  error:
 *                                      type: string
 *                                      example: Failed to fetch this survivor
 * */

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

/** 
 * @swagger 
 * /api/survivors:
 *    post:
 *      summary: Create a new survivor.
 *      description: Creates a new survivor record in the database.
 *      tags: 
 *          - Survivors
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - firstname
 *                          - lastname
 *                          - age
 *                      properties:
 *                          firstname:
 *                              type: string
 *                              example: Alice
 *                          lastname:
 *                              type: string
 *                              example: Walker
 *                          age:
 *                              type: integer
 *                              example: 29
 *                          skill:
 *                              type: string
 *                              enum: [medic, scout, engineer, fighter, hunter]
 *                              example: medic
 *                          health_status:
 *                              type: string
 *                              enum: [healthy, injured, infected]
 *                              example: healthy
 *                          safehouse_id:
 *                              type: integer
 *                              example: 2
 *      responses:
 *          201:
 *              description: Survivor successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 10
 *                                  firstname:
 *                                      type: string
 *                                      example: Alice
 *                                  lastname:
 *                                      type: string
 *                                      example: Walker
 *                                  age:
 *                                      type: integer
 *                                      example: 29
 *                                  skill:
 *                                      type: string
 *                                      example: medic
 *                                  health_status:
 *                                      type: string
 *                                      example: healthy
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 2
 *          400:
 *              description: Invalid request data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: integer
 *                                  example: 404
 *                              error:
 *                                  type: string
 *                                  example: firstname and lastname are required!
 *          500:
 *              description: Server error when creating survivor
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: integer
 *                                      example: 505 
 *                                  error:
 *                                      type: string
 *                                      example: Failed to create survivor
 * */

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

/** 
 * @swagger 
 * /api/survivors/{id}:
 *    put:
 *      summary: Update a survivor.
 *      description: Updates an existing survivor by ID.
 *      tags: 
 *          - Survivors
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the survivor to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - firstname
 *                          - lastname
 *                          - age
 *                      properties:
 *                          firstname:
 *                              type: string
 *                              example: Alice
 *                          lastname:
 *                              type: string
 *                              example: Walker
 *                          age:
 *                              type: integer
 *                              example: 29
 *                          skill:
 *                              type: string
 *                              enum: [medic, scout, engineer, fighter, hunter]
 *                              example: medic
 *                          health_status:
 *                              type: string
 *                              enum: [healthy, injured, infected]
 *                              example: healthy
 *                          safehouse_id:
 *                              type: integer
 *                              example: 2
 *      responses:
 *          200:
 *              description: Survivor successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  firstname:
 *                                      type: string
 *                                      example: Alice
 *                                  lastname:
 *                                      type: string
 *                                      example: Walker
 *                                  age:
 *                                      type: integer
 *                                      example: 29
 *                                  skill:
 *                                      type: string
 *                                      example: medic
 *                                  health_status:
 *                                      type: string
 *                                      example: healthy
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 3
 *          400:
 *              description: Invalid request data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: integer
 *                                  example: 404
 *                              error:
 *                                  type: string
 *                                  example: firstname and lastname are required!
 *          500:
 *              description: Failed to fetch survivors
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: integer
 *                                      example: 505 
 *                                  error:
 *                                      type: string
 *                                      example: Failed to fetch survivors 
 * */

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

/** 
 * @swagger 
 * /api/survivors:
 *    get:
 *      summary: Get all survivors.
 *      description: Returns all survivors, with optional filtering by health status, skill, and safehouse ID.
 *      tags: 
 *          - Survivors
 *      parameters:
 *       - in: query
 *         name: health_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [healthy, injured, infected]
 *         description: Filter survivors by health status
 *       - in: query
 *         name: skill
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter survivors by skill
 *       - in: query
 *         name: safehouse_id
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [1,2,3,4,5,6]
 *         description: Filter survivors by safehouse ID
 *      responses:
 *          200:
 *              description: A list of survivors
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  firstname:
 *                                      type: string
 *                                      example: Alice
 *                                  lastname:
 *                                      type: string
 *                                      example: Walker
 *                                  age:
 *                                      type: integer
 *                                      example: 29
 *                                  skill:
 *                                      type: string
 *                                      example: medic
 *                                  health_status:
 *                                      type: string
 *                                      example: healthy
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 2
 *          404:
 *              description: No survivors found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: integer
 *                                  example: 404
 *                              error:
 *                                  type: string
 *                                  example: Survivor not found
 *          500:
 *              description: Failed to fetch survivors
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: integer
 *                                      example: 505 
 *                                  error:
 *                                      type: string
 *                                      example: Failed to fetch survivors 
 * */

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