import express from 'express'
import pool from '../db.js'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM supplies');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error with getting supplies: ', error);
        res.status(500).json({ error: 'Error! Could not get supplies!' });
    }
});

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
        console.error('Error with deleting supply: , error');
        res.status(500).json({ error: 'Error! Could not delete supply' });
    }
});

export default router;