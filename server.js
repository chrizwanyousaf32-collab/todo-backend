import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectdb } from "./config/db.js";

import todoRoutes from "./routes/todo.routes.js";
import userRoutes from "./routes/user.route.js";

import { errorHandler } from "./middlewares/errorHandler.js";

// Import cron jobs
import "./cron/reminder.cron.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectdb();

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});