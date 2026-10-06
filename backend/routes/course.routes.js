import express from "express";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET all active courses (Public)
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const filter = { isActive: true, isPublished: true };

    if (category && category !== "All") filter.category = category;
    if (level && level !== "All") filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subjects: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name profileImage specialization")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all categories (Public)
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET course by id (Public)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email profileImage specialization bio"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD course (Protected: Admin or Teacher)
router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructorName: req.user.name,
    });
    res.status(201).json({
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
