import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    // YYYY-MM-DD (matches your Attendance.date format)
    const today = new Date().toISOString().split("T")[0];

    const [
      totalEmployees,
      presentToday,
      pendingLeaves,
      activeTasks,
    ] = await Promise.all([
      Employee.countDocuments(),

      Attendance.countDocuments({
        date: today,
        status: { $in: ["Present", "Present (Late)"] },
      }),

      LeaveRequest.countDocuments({ status: "Terminated" }),

      Task.countDocuments({ status: "Pending" }),
    ]);

    const absentToday = totalEmployees - presentToday;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        presentToday,
        absentToday,
        pendingLeaves,
        activeTasks,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
