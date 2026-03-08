import express from 'express'
import pool from '../db.js'

const router = express.Router();

/**
 * @swagger
 * /api/supplies:
 *   get:
 *      summary: Retrieve a list of supplies, including safehouse name and location 
 *      description: Retrieve a list of supplies from zombiesurvival database. 
 *       Users are able to get a list of supplies including name, category, quantity, safehouse_id, safehous_name, and location.
 *      tags: [Supplies]
 *      responses:
 *          200:
 *              description: A list of supplies.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: The supply id
 *                                  example: 14
 *                              name:
 *                                  type: string
 *                                  description: The supply name
 *                                  example: Flashlight
 *                              category:
 *                                  type: string
 *                                  description: The supply category
 *                                  example: tools
 *                              quantity:
 *                                  type: integer
 *                                  description: The supply quantity
 *                                  example: 4
 *                              safehouse_id:
 *                                  type: integer
 *                                  description: The safehouse id number
 *                                  example: 1
 *                              safehouse:
 *                                  type: string
 *                                  description: The safehouse name
 *                                  example: Mall Fortress
 *                              location:
 *                                   type: string
 *                                   description: The safehous location
 *                                   example: Downtown Mall
*/
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                supply.id, 
                supply.name, 
                supply.category, 
                supply.quantity,
                supply.safehouse_id,
                safehouse.name as safehouse, 
                safehouse.location
            FROM supplies supply
            JOIN safehouses safehouse ON supply.safehouse_id = safehouse.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error with getting supplies, safehouse name, and location: ', error);
        res.status(500).json({ error: 'Error! Could not get supplies, safehouse name, and location!' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, category, quantity, safehouse_id } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Supply name is required!'
            });
        }

        if (!category) {
            return res.status(400).json({
                error: 'Category name is required!'
            });
        }

        if (quantity === undefined) {
            return res.status(400).json({
                error: 'Quantity is not a valid number!'
            });
        } else if (quantity < 0 || quantity > 100) {
            return res.status(400).json({
                error: 'Quantity should be greater than 0 or less than 100!'
            })
        }

        const result = await pool.query(
            `INSERT INTO events (name, category, quantity, safehouse_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, category, quantity, safehouse_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error! Could not add this supply!')
        res.status(500).json({ error: 'Error! Could not add this supply!' });
    }
});

/**
 * @swagger
 * /api/supplies/{id}:
 *   delete:
 *      summary: Removes a specific supply by id
 *      description: Remove a supply item using the id of the supply from the zombiesurvival database. 
 *      tags: [Supplies]
 *      responses:
 *          200:
 *              description: Remove a supply sucessfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: Message for successful supply removal
 *                                  example: The supply "Hammer" was deleted!
 *          500:
 *              description: Remove a supply unsuccessful.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: Message for unsuccessful supply removal
 *                                  example: Error! Could not delete supply item!
*/
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM supplies WHERE id=$1 RETURNING *', 
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'This supply does not exist!'});

        res.status(200).json({ message: `The supply "${result.rows[0].name}" was deleted!` })
    } catch (error) {
        console.error('Error with deleting supply: ', error);
        res.status(500).json({ error: 'Error! Could not delete supply item!' });
    }
});

export default router;