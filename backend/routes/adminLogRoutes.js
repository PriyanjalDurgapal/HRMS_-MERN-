import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Admin logs
router.get("/", authorize("admin","hr"), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
