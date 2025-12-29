import express from "express";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";

import {
  assignTask,
  getAvailableEmployees,
  getEmployeeAttendanceStatus,
  getAllTasks,
  terminateTask,
  updateTask,
  extendTask,
  togglePauseTask,
  getMyTasks,
  uploadTaskReport,
  requestStopTask,
} from "../controllers/taskController.js";

const router = express.Router();

/* ================= ADMIN / COORDINATOR ================= */
router.post("/assign", authorize("admin", "project_coordinator"), assignTask);

router.get(
  "/available-employees",
  authorize("admin", "project_coordinator"),
  getAvailableEmployees
);

router.get(
  "/employee-attendance-status",
  authorize("admin", "project_coordinator"),
  getEmployeeAttendanceStatus
);

router.get("/all", authorize("admin", "project_coordinator"), getAllTasks);

router.patch(
  "/:id/terminate",
  authorize("admin", "project_coordinator"),
  terminateTask
);

router.patch(
  "/:id",
  authorize("admin", "project_coordinator"),
  updateTask
);

router.patch(
  "/:id/extend",
  authorize("admin", "project_coordinator"),
  extendTask
);

router.patch(
  "/:id/pause",
  authorize("admin", "project_coordinator"),
  togglePauseTask
);

/* ================= EMPLOYEE ================= */
router.get("/my", authorize("employee", "project_coordinator"), getMyTasks);

router.post(
  "/:id/report",
  authorize("employee", "project_coordinator"),
  upload.single("report"),
  uploadTaskReport
);

router.patch(
  "/:id/request-stop",
  authorize("employee", "project_coordinator"),
  requestStopTask
);

export default router;
