import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.route.js";
import gameRoutes from "./routes/game.route.js";
import experienceRoutes from "./routes/experience.route.js";
import dbConnection from "./config/db.js";

dotenv.config();

/* -------------------- DATABASE -------------------- */
dbConnection();

/* -------------------- APP -------------------- */
const app = express();
const port = process.env.PORT || 5000;

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 GameLog API is running",
    environment: process.env.NODE_ENV
  });
});


/* -------------------- MIDDLEWARES -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/experience", experienceRoutes);

/* -------------------- SERVER -------------------- */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
