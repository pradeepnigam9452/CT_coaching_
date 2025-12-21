import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  const data = await Course.find({});
  res.json(data);
});

// GET course by id
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD course
router.post("/", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
