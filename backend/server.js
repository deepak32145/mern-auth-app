import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/connectDb.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hellow world");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("server is running on port 3000");
});
