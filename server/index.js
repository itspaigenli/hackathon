import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import safehouseRoutes from "./routes/safehouses.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/safehouses", safehouseRoutes);

app.get("/api/hello", (req, res) => {
  console.log("GET /api/hello hit");
  res.json({ message: "Hello from us!" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
