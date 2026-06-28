import Todo from "../models/todo.model.js";

export const checkReminders = async () => {
  try {
    const now = new Date();

    const today = now.toISOString().split("T")[0];

    const currentTime = now.toTimeString().slice(0, 5);

    const todos = await Todo.find({
      reminderDate: {
        $ne: null,
      },
      reminderTime: currentTime,
    });

    todos.forEach((todo) => {
      const reminderDate = new Date(todo.reminderDate)
        .toISOString()
        .split("T")[0];

      if (reminderDate === today) {
        console.log("================================");
        console.log("🔔 REMINDER");
        console.log(`Title: ${todo.title}`);
        console.log(`Description: ${todo.description}`);
        console.log(`Due Date: ${todo.dueDate}`);
        console.log("================================");
      }
    });
  } catch (error) {
    console.error("Reminder Error:", error.message);
  }
};