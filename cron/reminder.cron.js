import cron from "node-cron";
import { checkReminders } from "../services/reminder.service.js";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking reminders...");

  await checkReminders();
});

console.log("✅ Reminder Cron Started");