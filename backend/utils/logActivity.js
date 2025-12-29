import ActivityLog from "../models/ActivityLog.js";

const logActivity = async ({
  userId,
  name,
  userType,
  action,
  description,
  req,
}) => {
  try {
    await ActivityLog.create({
      userId,
      name,
      userType,
      action,
      description,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    console.error("Log error:", err.message);
  }
};

export default logActivity;