import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logActivity from "../utils/logActivity.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    
    if (!user) {
      await logActivity({
        userType: "admin",
        action: "FAILED_LOGIN",
        description: "Admin not found",
        req,
      });

      return res.status(404).json({ message: "User not found" });
    }

 
    if (user.role !== role) {
      await logActivity({
        userId: user._id,
        name: user.name,
        userType: "admin",
        action: "FAILED_LOGIN",
        description: "Unauthorized role attempt",
        req,
      });

      return res.status(401).json({ message: "Unauthorized role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

  
    if (!isMatch) {
      await logActivity({
        userId: user._id,
        name: user.name,
        userType: "admin",
        action: "FAILED_LOGIN",
        description: "Invalid admin password",
        req,
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    await logActivity({
      userId: user._id,
      name: user.name,
      userType: "admin",
      action: "LOGIN_SUCCESS",
      description: "Admin logged in",
      req,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;