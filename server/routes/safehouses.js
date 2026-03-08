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

/** 
 * @swagger 
 * /api/safehouses/{id}/survivors:
 *    get:
 *      summary: Get survivors in a safehouse.
 *      description: Returns all survivors assigned to a specific safehouse, along with the total count.
 *      tags: 
 *          - Safehouses
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the safehouse.
 *      responses:
 *          200:
 *              description: Survivors successfully retrieved
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 1
 *                                  count:
 *                                      type: integer
 *                                      example: 1
 *                                  survivors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: integer
 *                                                  example: 1
 *                                              firstname:
 *                                                  type: string
 *                                                  example: Alice
 *                                              lastname:
 *                                                  type: string
 *                                                  xample: Walker
 *                                              age:
 *                                                  type: integer
 *                                                  example: 29
 *                                              skill:
 *                                                  type: string
 *                                                  example: medic
 *                                              health_status:
 *                                                  type: string
 *                                                  example: healthy
 *                                              safehouse_id:
 *                                                  type: integer
 *                                                  example: 2
 *          404:
 *              description: No survivors found for this safehouse
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
 *              description: Server error when fetching survivors
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

// GET survivor in a safe house
router.get("/:id/survivors", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM survivors
             WHERE safehouse_id = $1
             ORDER BY id ASC`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survivor not found" });
    }

    res.status(200).json({
      safehouse_id: id,
      count: result.rows.length,
      survivors: result.rows,
    });
  } catch (error) {
    console.error("Error fetching survivors for safehouse:", error);
    res.status(500).json({ error: "Failed to fetch survivors" });
  }
});

/** 
 * @swagger 
 * /api/safehouses/{id}/supplies:
 *    get:
 *      summary: Get supplies in a safehouse.
 *      description: Returns all supplies stored in a specific safehouse.
 *      tags: 
 *          - Safehouses
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the safehouse.
 *      responses:
 *          200:
 *              description: Supplies successfully retrieved
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
 *                                  name:
 *                                      type: string
 *                                      example: First Aid Kit
 *                                  category:
 *                                      type: string
 *                                      example: medicine
 *                                  quantity:
 *                                      type: integer
 *                                      example: 5
 *                                  safehouse_id:
 *                                      type: integer
 *                                      example: 1
 *          404:
 *              description: No supplies found for this safehouse
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
 *                                  example: Supplies not found
 *          500:
 *              description: Server error when retrieving supplies
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
 *                                      example: Failed to fetch supplies
 * */

// GET supplies in a safe house
router.get("/:id/supplies", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM supplies
             WHERE safehouse_id = $1
             ORDER BY id ASC`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplies not found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching supplies for safehouse:", error);
    res.status(500).json({ error: "Failed to fetch supplies" });
  }
});

export default router;
