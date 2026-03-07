// Database configuration file

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Database connection test query
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("Database connected:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

export default pool;
