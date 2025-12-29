

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const admin = await User.findById(decoded.id || decoded.userId || decoded._id);
    
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default verifyAdmin;