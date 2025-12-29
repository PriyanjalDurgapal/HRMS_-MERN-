import express from "express";
import {
  markAttendance,
  adminAttendance,
  hrAttendance,
  requestHalfDay,
  approveHalfDay,
} from "../controllers/attendanceController.js";

import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/mark", authorize(), markAttendance);

router.get("/admin", authorize("admin","hr"), adminAttendance);

router.get("/hr", authorize("hr"), hrAttendance);

router.post("/half-day/request", authorize(), requestHalfDay);

router.put(
  "/half-day/approve/:attendanceId",
  authorize("admin","hr"),
  approveHalfDay
);

export default router;
