// middleware/auth.js

require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

const MAX_FAILED_ATTEMPTS = 3; // Allowed failed attempts before lockout
const LOCK_TIME = 10 * 60 * 1000; // Lock time in milliseconds (10 minutes)

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to authorize roles
const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text:
        `You are receiving this email because a request was made to reset your password. Click the following link to reset your password:\n\n` +
        `http://your-frontend-url.com/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error); // Log the exact error here
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Password reset email sent successfully"); // Confirmation message for successful email
      res
        .status(200)
        .json({ success: true, message: "Password reset link sent!" });
    });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export middleware functions and router
module.exports = { authenticateToken, authorizeRole, router };
