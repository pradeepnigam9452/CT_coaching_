import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  const data = await Student.find({});
  res.json(data);
});

// ADD student
router.post("/", async (req, res) => {
  try {
    const { name, email, batch, role } = req.body;

    const user = await Student.create({
      name,
      email,
      batch,
      role,
    });

    res.status(201).json({
      message: "Student added successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
