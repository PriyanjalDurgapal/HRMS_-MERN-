import cron from "node-cron";
import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";
import { generatePayroll } from "../controllers/payrollController.js";

// Last day of month at 23:59
cron.schedule("59 23 28-31 * *", async () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  if (today.getDate() !== lastDay) return;

  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();

  const employees = await Employee.find();
  for (const emp of employees) {
    const exists = await Payroll.findOne({ employee: emp._id, month, year });
    if (!exists) {
      try {
        await generatePayroll({ employeeId: emp._id, month, year, auto: true });
      } catch (err) {
        console.error("Auto payroll error:", err);
      }
    }
  }
});
