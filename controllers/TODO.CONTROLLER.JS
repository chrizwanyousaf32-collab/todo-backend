import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// =======================
// CREATE TODO
// =======================
export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const todo = await Todo.create({ title, description });

  return res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

// =======================
// GET ALL TODOS
// =======================
export const getTodos = asyncHandler(async (req, res) => {
  const { search, sort, page = 1, limit = 10 } = req.query;

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const sortOption = {
    createdAt: sort === "asc" ? 1 : -1,
  };

  const skip = (Number(page) - 1) * Number(limit);

  const todos = await Todo.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Todo.countDocuments(query);

  return res.status(200).json({
    success: true,
    message: "Todos fetched successfully",
    total,
    page: Number(page),
    limit: Number(limit),
    data: todos,
  });
});

// =======================
// GET TODO BY ID
// =======================
export const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: todo,
  });
});

// =======================
// UPDATE TODO
// =======================
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const todo = await Todo.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true }
  );

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: todo,
  });
});

// =======================
// DELETE TODO
// =======================
export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
});

// =======================
// TOGGLE TODO
// =======================
export const toggleTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  return res.status(200).json({
    success: true,
    message: "Todo toggled successfully",
    data: todo,
  });
});