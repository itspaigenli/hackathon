import pool from '../db.js'

export const getAllSupplies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM supplies');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}