import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayroll,
  fetchEmployees,
  toggleAutoDeduction,
  markAsPaid,
  downloadPayslip,
} from "../controllers/payrollController.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Admin-only routes
router.post("/generate", authorize("admin"), generatePayroll);
router.get("/all", authorize("admin"), getAllPayrolls);
router.get("/employees", authorize("admin"), fetchEmployees);

router.patch("/:id/toggle-deduction", authorize("admin"), toggleAutoDeduction);
router.patch("/:id/paid", authorize("admin"), markAsPaid);
router.get("/:id/payslip", authorize("admin"), downloadPayslip);

// Employee route
router.get("/me", authorize("employee","hr","project_coordinator"), getMyPayroll);

export default router;
