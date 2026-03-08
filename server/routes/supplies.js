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

/**
 * @swagger
 * /api/supplies:
 *   post:
 *      summary: Add a supply to inventory of supplies.
 *      description: Add a newly created supply to the current inventory of supplies from zombiesurvival database. 
 *       Users are able to add a add a new supply including name, category, quantity, and safehouse using safehouse_id.
 *      tags: [Supplies]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - category
 *                          - quantity
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Flashlight
 *                          category:
 *                              type: string
 *                              example: tools
 *                          quantity:
 *                              type: integer
 *                              example: 4
 *                          safehouse_id:
 *                              type: integer
 *                              example: 1
 *      responses:
 *          201:
 *              description: Add a supply successful.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
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
 *          400:
 *              description: Error with request for adding a supply.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: "Category name is required!"
 *          409:
 *              description: Conflict with request adding a duplicate supply.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: '"Flashlight" already exists in safehouse 1.'
 *          500:
 *              description: Server error with adding supply.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Error! Could not add this supply!
*/
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

        const is_duplicateSupply = await pool.query(
            `SELECT * 
             FROM supplies 
             WHERE name = $1 AND safehouse_id = $2`,
            [name, safehouse_id]
        );

        if (is_duplicateSupply.rows.length > 0) {
            return res.status(409).json({
                error: `"${name}" already exists in safehouse ${safehouse_id}.`
            });
        }

        const result = await pool.query(
            `INSERT INTO supplies (name, category, quantity, safehouse_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, category, quantity, safehouse_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error! Could not add this supply!', error);
        res.status(500).json({ error: 'Error! Could not add this supply!' });
    }
});

/**
 * @swagger
 * /api/supplies/{id}/quantity:
 *   patch:
 *      summary: Reduce a supply quantity by 1 in inventory of supplies.
 *      description: Reduce a supply quantity by one from inventory of supplies from zombiesurvival database. 
 *       Users are able to "use" a supply which is then reduced by 1.
 *      tags: [Supplies]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The ID of the supply
 *            schema:
 *              type: integer
 *              example: 1
 *      responses:
 *          200:
 *              description: Supply quantity sucessfully reduced.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: The supply id
 *                                  example: 1
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
 *                                  example: 3
 *                              safehouse_id:
 *                                  type: integer
 *                                  description: The safehouse id number
 *                                  example: 1
 *          404:
 *              description: Error with request for reducing a supply.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: 'This supply does not exist or quantity is already 0!'
 *          500:
 *              description: Error with updating supply.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: 'Error! Could not update quantity for this supply!'
*/
router.patch('/:id/quantity', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `UPDATE supplies 
            SET quantity = quantity - 1 
            WHERE id=$1 AND quantity > 0
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'This supply does not exist or quantity is already 0!'
            });
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error! Could not update quantity for this supply!', error);
        res.status(500).json({ error: 'Supply quantity not updated!' });
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