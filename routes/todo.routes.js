import express from "express";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getFocusTodos,
} from "../controllers/todo.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", auth, createTodo);

router.get("/", auth, getTodos);

// IMPORTANT: keep this before "/:id"
router.get("/focus", auth, getFocusTodos);

router.get("/:id", auth, getTodoById);

router.put("/:id", auth, updateTodo);

router.patch("/:id/toggle", auth, toggleTodo);

router.delete("/:id", auth, deleteTodo);

export default router;