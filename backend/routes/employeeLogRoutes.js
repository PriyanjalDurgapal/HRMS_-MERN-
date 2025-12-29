import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authorize("employee","project_coordinator"), async (req, res) => {
  const logs = await ActivityLog.find({
    userId: req.user._id,
    userType: "employee",
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(logs);
});

export default router;
