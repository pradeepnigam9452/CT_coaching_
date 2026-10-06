import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || "SECRET_KEY",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, phone, batch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = ["student", "teacher", "admin"].includes(role)
      ? role
      : "student";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: validRole,
      phone: phone || "",
      batch: batch || "General",
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name
      )}`,
    });

    const token = signToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        batch: user.batch,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Failed to register" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is disabled. Please contact administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        batch: user.batch,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

// GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PROFILE
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, bio, profileImage, specialization, batch } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (specialization !== undefined) user.specialization = specialization;
    if (batch !== undefined) user.batch = batch;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        batch: user.batch,
        specialization: user.specialization,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHANGE PASSWORD
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CONTACT US
router.post("/contact", async (req, res) => {
  const { name, email, message, phone } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email, and message are required",
    });
  }
  console.log("Contact Message Received:", { name, email, message, phone });
  res.status(200).json({
    message: "Thank you for contacting CT Coaching Center! Our admissions team will reach out soon.",
  });
});

export default router;
