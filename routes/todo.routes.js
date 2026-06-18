import express from "express";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

// CREATE TODO
router.post("/", createTodo);

// GET ALL TODOS
router.get("/", getTodos);

// GET TODO BY ID
router.get("/:id", getTodoById);

// UPDATE TODO
router.put("/:id", updateTodo);

// TOGGLE TODO COMPLETION
router.patch("/:id/toggle", toggleTodo);
//DELETE TODO BY ID 
router.delete("/:id",deleteTodo);

export default router;