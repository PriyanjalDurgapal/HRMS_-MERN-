import express from "express";
import { employeeLogin } from "../controllers/employeeAuthController.js";
import { getDashboard } from "../controllers/employeeController.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/login", employeeLogin);

router.get("/dashboard", authorize("employee","project_coordinator"), getDashboard);

export default router;
