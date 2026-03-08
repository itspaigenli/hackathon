import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import safehouseRoutes from "./routes/safehouses.js";
import survivorsRouter from "./routes/survivors.js";
import suppliesRoutes from "./routes/supplies.js";
import limiter from "./routes/ratelimit.js";
import swaggerUi from 'swagger-ui-express'
import swaggerSpecs from "./docs/swagger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", limiter);

app.get("/api/hello", (req, res) => {
  console.log("GET /api/hello hit");
  res.json({ message: "Use Your Head: Cut Off Theirs." });
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

app.use("/api/survivors", survivorsRouter);
app.use("/api/safehouses", safehouseRoutes);
app.use("/api/supplies", suppliesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
