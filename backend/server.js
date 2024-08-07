import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";

import authRoutes from "./routes/auth.route.js";

const app = express();

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hellow world");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("server is running on port 3000");
});
