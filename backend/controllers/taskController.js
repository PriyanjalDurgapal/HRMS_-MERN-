import Task from "../models/Task.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

/* ================= AI IMPORTANCE (UNCHANGED) ================= */
const detectImportance = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();

  if (text.includes("urgent") || text.includes("asap") || text.includes("critical"))
    return "Critical";

  if (text.includes("important") || text.includes("priority"))
    return "High";

  if (text.includes("minor") || text.includes("optional"))
    return "Low";

  return "Medium";
};

/* ================= ADMIN / COORDINATOR ================= */

// Assign Task
export const assignTask = async (req, res) => {
  const { title, description, employeeId, estimatedHours, importance } = req.body;

  if (!employeeId)
    return res.status(400).json({ message: "Employee ID required" });

  if (
    req.user.role === "project_coordinator" &&
    employeeId.toString() === req.user._id.toString()
  ) {
    return res.status(403).json({
      message: "Project Coordinator cannot assign task to themselves",
    });
  }

  try {
    const startTime = new Date();
    const dueDate = new Date(startTime.getTime() + estimatedHours * 3600000);

    const task = await Task.create({
      title,
      description,
      assignedTo: employeeId,
      assignedBy: req.user._id,
      assignedByRole: req.user.role,
      estimatedHours,
      importance: importance || detectImportance(title, description),
      startTime,
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name employeeId")
      .populate("assignedBy", "name");

    res.json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Available Employees
export const getAvailableEmployees = async (req, res) => {
  try {
    const activeTasks = await Task.find({
      status: { $in: ["Pending", "In Progress", "Paused"] },
    }).select("assignedTo");

    const busyIds = activeTasks
      .map(t => t.assignedTo?.toString())
      .filter(Boolean);

    const employees = await Employee.find({
      _id: { $nin: busyIds },
    }).select("name employeeId");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Attendance Status
export const getEmployeeAttendanceStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.find({ date: today })
      .populate("employee", "name employeeId _id");

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: { $nin: ["Completed", "Terminated"] },
    })
      .populate("assignedTo", "name employeeId")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Terminate Task
export const terminateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "project_coordinator" &&
      task.assignedTo.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Project Coordinator cannot terminate their own task",
      });
    }

    task.status = "Terminated";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Extend Task
export const extendTask = async (req, res) => {
  const { additionalHours } = req.body;
  if (!additionalHours || additionalHours <= 0)
    return res.status(400).json({ message: "Invalid hours" });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.estimatedHours += Number(additionalHours);
    task.dueDate = new Date(
      task.dueDate.getTime() + additionalHours * 3600000
    );

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pause / Resume
export const togglePauseTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "project_coordinator" &&
      task.assignedTo.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Project Coordinator cannot pause their own task",
      });
    }

    task.status =
      task.status === "In Progress" ? "Paused" : "In Progress";

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= EMPLOYEE ================= */

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedBy", "name")
      .select(
        "title description estimatedHours importance status reportFile dueDate startTime"
      );

    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadTaskReport = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedTo.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    task.reportFile = req.file.path;
    task.status = "Completed";
    await task.save();

    res.json({ message: "Report uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestStopTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.assignedTo.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    task.status = "Stop Requested";
    await task.save();

    res.json({ message: "Stop request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
