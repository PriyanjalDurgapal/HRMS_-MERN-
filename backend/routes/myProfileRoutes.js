import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/myProfileController.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/me", authorize("employee","hr","project_coordinator"), getMyProfile);
router.put("/me", authorize("employee","hr","project_coordinator"), updateMyProfile);

export default router;
