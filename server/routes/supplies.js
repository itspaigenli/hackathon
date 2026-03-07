import pool from '../db.js'

export const getAllSupplies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM supplies');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error with getting supplies: ', error);
        res.status(500).json({ error: 'Error! Could not get supplies!' });
    }
}