import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cron from "node-cron";
import http from "http";

import authRoute from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import employeeAuthRoutes from "./routes/employeeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import myProfileRoutes from "./routes/myProfileRoutes.js";
import changePasswordRoutes from "./routes/changePasswordRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminLogRoutes from "./routes/adminLogRoutes.js";
import employeeLogRoutes from "./routes/employeeLogRoutes.js";
import formerEmployeeRoutes from "./routes/formerEmployee.js";
import payrollRoutes from "./routes/payrollRoutes.js";

import Attendance from "./models/Attendance.js";
import { autoGenerateAttendance } from "./controllers/attendanceController.js";
import initSocket from "./socket/socket.js";
import "./cronJobs/autoPayroll.js";

dotenv.config();

const app = express();

/* ===============================
   CORS (Production Ready)
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL, 
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   Routes
================================ */
app.use("/api/auth", authRoute);
app.use("/api/hr", hrRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employees", formerEmployeeRoutes);
app.use("/api/employee-auth", employeeAuthRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", myProfileRoutes);
app.use("/api/change-password", changePasswordRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/admin/logs", adminLogRoutes);
app.use("/api/employee/logs", employeeLogRoutes);
app.use("/api/chat", chatRoutes);

/* ===============================
   Static files
================================ */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===============================
   MongoDB Connection
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    /* Auto Generate Attendance Daily */
    cron.schedule("55 9 * * *", async () => {
      try {
        await autoGenerateAttendance();
        console.log("Attendance generated at 9:55 AM");
      } catch (err) {
        console.error("Auto-generate error:", err.message);
      }
    });

    /* Auto Mark Absent at 6:00 PM */
    cron.schedule("0 18 * * *", async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        await Attendance.updateMany(
          { date: today, status: "Absent" },
          { status: "Absent" }
        );

        console.log("Auto absent check executed at 6:00 PM");
      } catch (err) {
        console.error("Auto-absent error:", err.message);
      }
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

/* ===============================
   Health Check
================================ */
app.get("/", (req, res) => {
  res.send("HRMS Backend Running");
});

/* ===============================
   Socket.IO
================================ */
const server = http.createServer(app);
initSocket(server);

/* ===============================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);