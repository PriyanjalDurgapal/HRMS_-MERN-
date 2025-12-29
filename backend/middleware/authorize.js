import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

/**
 * Unified Authentication & Authorization Middleware
 * @param {...string} roles - allowed roles (admin, hr, employee, coordinator)
 */
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers?.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authentication token missing",
        });
      }

      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const userId = payload.id ?? payload.userId ?? payload._id;

      // Try Admin first
      let account = await User.findById(userId).lean();

      // If not admin, try Employee (HR / Employee / Coordinator)
      if (!account) {
        account = await Employee.findById(userId).lean();
      }

      if (!account) {
        return res.status(401).json({
          success: false,
          message: "Account not found",
        });
      }

      // Role authorization
      if (roles.length && !roles.includes(account.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Attach minimal user info to request
      req.user = {
        _id: account._id,
        role: account.role,
        name: account.name,
        email: account.email,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default authorize;
