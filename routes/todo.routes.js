import express from "express";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE TODO
router.post("/", auth, createTodo);

// GET ALL TODOS
router.get("/", auth, getTodos);

// GET TODO BY ID
router.get("/:id", auth, getTodoById);

// UPDATE TODO
router.put("/:id", auth, updateTodo);

// TOGGLE TODO
router.patch("/:id/toggle", auth, toggleTodo);

// DELETE TODO
router.delete("/:id", auth, deleteTodo);

export default router;