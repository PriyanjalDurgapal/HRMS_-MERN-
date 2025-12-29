import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get(
  "/dashboard-stats",
  authorize("admin","hr"),
  getDashboardStats
);

export default router;
