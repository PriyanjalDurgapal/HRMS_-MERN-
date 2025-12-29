import express from "express";
import {
  applyLeave,
  myLeaves,
  allLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

import authorize from "../middleware/authorize.js";

const router = express.Router();

/* ================= EMPLOYEE & HR ================= */
// both employee and HR can apply & view own leaves
router.post("/apply", authorize(), applyLeave);
router.get("/my", authorize(), myLeaves);

/* ================= HR ================= */
// HR can see all leaves & approve (controller blocks self-approval)
router.get("/all", authorize("hr"), allLeaves);
router.patch("/:id", authorize("hr"), updateLeaveStatus);

/* ================= ADMIN ================= */
// Admin uses separate auth (User collection)
router.get("/admin/all", authorize("admin","hr"), allLeaves);
router.patch("/admin/:id", authorize("admin","hr"), updateLeaveStatus);

export default router;
