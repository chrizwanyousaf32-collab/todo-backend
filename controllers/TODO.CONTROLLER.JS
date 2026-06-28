import Todo from "../models/todo.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// =======================
// CREATE TODO
// =======================
export const createTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dueDate,
    priority,
    category,
    status,
    reminderDate,
    reminderTime,
    repeat,
    repeatDay,
  } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }
  }

  const todo = await Todo.create({
    title,
    description,
    dueDate,
    priority,
    category,
    status,
    reminderDate,
    reminderTime,
    repeat,
    repeatDay,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

// =======================
// GET ALL TODOS
// =======================
export const getTodos = asyncHandler(async (req, res) => {
  const {
    search,
    sort = "desc",
    page = 1,
    limit = 10,
    priority,
    category,
    status,
    isCompleted,
  } = req.query;

  let query = {
    user: req.user.id,
  };

  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (status) query.status = status;

  if (isCompleted !== undefined) {
    query.isCompleted = isCompleted === "true";
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

  res.status(200).json({
    success: true,
    total,
    totalPages: Math.ceil(total / Number(limit)),
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

  const todo = await Todo.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.status(200).json({
    success: true,
    data: todo,
  });
});

// =======================
// UPDATE TODO
// =======================
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const {
    title,
    description,
    dueDate,
    priority,
    category,
    status,
    reminderDate,
    reminderTime,
    repeat,
    repeatDay,
    isCompleted,
  } = req.body;

  // Fix 1: Validate title is not empty if provided
  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title cannot be empty",
    });
  }

  // Fix 2: Check for invalid date AND past date (consistent with createTodo)
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates are not allowed",
      });
    }
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (priority !== undefined) updateData.priority = priority;
  if (category !== undefined) updateData.category = category;
  if (status !== undefined) updateData.status = status;
  if (reminderDate !== undefined) updateData.reminderDate = reminderDate;
  if (reminderTime !== undefined) updateData.reminderTime = reminderTime;
  if (repeat !== undefined) updateData.repeat = repeat;
  if (repeatDay !== undefined) updateData.repeatDay = repeatDay;
  if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

  const todo = await Todo.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.status(200).json({
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

  const todo = await Todo.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  // Fix 3: Changed success: false to success: true
  res.status(200).json({
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

  const todo = await Todo.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  todo.isCompleted = !todo.isCompleted;

  // Update status automatically
  todo.status = todo.isCompleted ? "Completed" : "Pending";

  await todo.save();

  res.status(200).json({
    success: true,
    message: "Todo toggled successfully",
    data: todo,
  });
});

// =======================
// FOCUS TODOS
// =======================
export const getFocusTodos = asyncHandler(async (req, res) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const todayTodos = await Todo.find({
    user: req.user.id,
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const overdueTodos = await Todo.find({
    user: req.user.id,
    dueDate: {
      $lt: startOfDay,
    },
    isCompleted: false,
  });

  const upcomingTodos = await Todo.find({
    user: req.user.id,
    dueDate: {
      $gt: endOfDay,
    },
  });

  const completedTodos = await Todo.find({
    user: req.user.id,
    isCompleted: true,
  });

  const pendingTodos = await Todo.find({
    user: req.user.id,
    isCompleted: false,
  });

  res.status(200).json({
    success: true,
    data: {
      today: todayTodos,
      overdue: overdueTodos,
      upcoming: upcomingTodos,
      completed: completedTodos,
      pending: pendingTodos,
    },
  });
});