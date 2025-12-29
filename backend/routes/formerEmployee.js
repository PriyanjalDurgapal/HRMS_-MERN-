import express from "express";
import FormerEmployee from "../models/FormerEmployee.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

/* ================= GET FORMER EMPLOYEES ================= */
router.get("/former", authorize("admin","hr"), async (req, res) => {
  try {
    const former = await FormerEmployee.find().sort({ deletedAt: -1 });
    res.json(former);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch former employees" });
  }
});

export default router;
