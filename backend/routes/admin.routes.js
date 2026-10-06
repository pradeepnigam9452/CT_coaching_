import express from "express";
import bcrypt from "bcrypt";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import Enrollment from "../models/Enrollment.js";
import Test from "../models/Test.js";
import TestResult from "../models/TestResult.js";
import StudyMaterial from "../models/StudyMaterial.js";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Apply auth & admin role only
router.use(protect);
router.use(authorize("admin"));

// 1. ADMIN DASHBOARD OVERVIEW & ANALYTICS
router.get("/dashboard", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalCourses = await Course.countDocuments({});
    const totalEnrollments = await Enrollment.countDocuments({});
    const totalTests = await Test.countDocuments({});

    // Calculate approximate platform revenue based on course prices * enrollments
    const enrollments = await Enrollment.find().populate("course", "price title category");
    let totalRevenue = 0;
    enrollments.forEach((e) => {
      if (e.course && e.course.price) {
        totalRevenue += e.course.price;
      }
    });

    // Recent user registrations
    const recentRegistrations = await User.find()
      .select("name email role profileImage createdAt isActive batch")
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate("student", "name email profileImage")
      .populate("course", "title category price")
      .sort({ createdAt: -1 })
      .limit(6);

    // Popular courses by enrollment count
    const allCourses = await Course.find().select("title category price rating seatsAvailable");
    const courseEnrollmentCounts = {};
    enrollments.forEach((e) => {
      if (e.course?._id) {
        const idStr = e.course._id.toString();
        courseEnrollmentCounts[idStr] = (courseEnrollmentCounts[idStr] || 0) + 1;
      }
    });

    const popularCourses = allCourses
      .map((c) => ({
        _id: c._id,
        title: c.title,
        category: c.category,
        price: c.price,
        rating: c.rating || 4.8,
        enrolledCount: courseEnrollmentCounts[c._id.toString()] || 0,
      }))
      .sort((a, b) => b.enrolledCount - a.enrolledCount)
      .slice(0, 5);

    // Recent test results across platform
    const recentTestResults = await TestResult.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      metrics: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        totalTests,
        totalRevenue,
      },
      recentRegistrations,
      recentEnrollments,
      popularCourses,
      recentTestResults,
      monthlyGrowth: [
        { month: "Jan", students: Math.max(10, totalStudents - 40), enrollments: Math.max(15, totalEnrollments - 30) },
        { month: "Feb", students: Math.max(18, totalStudents - 28), enrollments: Math.max(22, totalEnrollments - 20) },
        { month: "Mar", students: Math.max(26, totalStudents - 15), enrollments: Math.max(34, totalEnrollments - 10) },
        { month: "Apr", students: totalStudents, enrollments: totalEnrollments },
      ],
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. STUDENT MANAGEMENT
router.get("/students", async (req, res) => {
  try {
    const { search, batch, status } = req.query;
    const filter = { role: "student" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (batch && batch !== "all") filter.batch = batch;
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    const students = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const enrollments = await Enrollment.find().populate("course", "title");
    const testResults = await TestResult.find();

    const formattedStudents = students.map((s) => {
      const userEnrollments = enrollments.filter(
        (e) => e.student?.toString() === s._id.toString()
      );
      const userTests = testResults.filter(
        (r) => r.student?.toString() === s._id.toString()
      );
      const avgScore = userTests.length > 0
        ? Math.round(userTests.reduce((acc, t) => acc + (t.percentage || 0), 0) / userTests.length)
        : 0;

      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        phone: s.phone || "—",
        batch: s.batch,
        profileImage: s.profileImage,
        isActive: s.isActive,
        createdAt: s.createdAt,
        enrolledCoursesCount: userEnrollments.length,
        courses: userEnrollments.map((e) => ({
          title: e.course?.title || "Course",
          progress: e.progress,
        })),
        testsCompleted: userTests.length,
        avgScore,
      };
    });

    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/students", async (req, res) => {
  try {
    const { name, email, password, phone, batch } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "student",
      phone: phone || "",
      batch: batch || "FSD",
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      isActive: true,
    });

    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/students/:id", async (req, res) => {
  try {
    const { name, email, phone, batch, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Student not found" });

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;
    if (batch !== undefined) user.batch = batch;
    if (isActive !== undefined) user.isActive = isActive;
    if (password && password.length >= 6) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Student updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/students/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Student not found" });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Student ${user.isActive ? "activated" : "deactivated"}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Student not found" });

    // Clean up student enrollments and test results
    await Enrollment.deleteMany({ student: req.params.id });
    await TestResult.deleteMany({ student: req.params.id });

    res.json({ message: "Student and associated records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. TEACHER MANAGEMENT
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .sort({ createdAt: -1 });

    const courses = await Course.find();
    const formattedTeachers = teachers.map((t) => {
      const assigned = courses.filter(
        (c) =>
          c.instructor?.toString() === t._id.toString() ||
          c.instructorName?.toLowerCase() === t.name.toLowerCase()
      );

      return {
        _id: t._id,
        name: t.name,
        email: t.email,
        phone: t.phone || "—",
        specialization: t.specialization || "Computer Science",
        profileImage: t.profileImage,
        isActive: t.isActive,
        createdAt: t.createdAt,
        assignedCoursesCount: assigned.length,
        courses: assigned.map((c) => ({ _id: c._id, title: c.title })),
      };
    });

    res.json(formattedTeachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/teachers", async (req, res) => {
  try {
    const { name, email, password, phone, specialization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "teacher",
      phone: phone || "",
      specialization: specialization || "Software Engineering",
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      isActive: true,
    });

    res.status(201).json({ message: "Teacher added successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/teachers/:id", async (req, res) => {
  try {
    const { name, email, phone, specialization, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Teacher not found" });

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;
    if (specialization !== undefined) user.specialization = specialization;
    if (isActive !== undefined) user.isActive = isActive;
    if (password && password.length >= 6) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Teacher updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/teachers/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Teacher not found" });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Teacher ${user.isActive ? "activated" : "deactivated"}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. CATEGORY MANAGEMENT
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const courses = await Course.find();

    const formatted = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
      description: cat.description,
      icon: cat.icon,
      isActive: cat.isActive,
      courseCount: courses.filter((c) => c.category === cat.name).length,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, description, icon, isActive = true } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await Category.create({ name, slug, description, icon, isActive });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, "-");
    }
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. COURSE MANAGEMENT (ADMIN FULL CRUD)
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email profileImage")
      .sort({ createdAt: -1 });

    const enrollments = await Enrollment.find();

    const formatted = courses.map((c) => {
      let totalLessons = 0;
      c.modules?.forEach((m) => {
        totalLessons += m.lessons?.length || 0;
      });

      const enrolledCount = enrollments.filter(
        (e) => e.course?.toString() === c._id.toString()
      ).length;

      return {
        _id: c._id,
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level,
        price: c.price,
        duration: c.duration,
        mode: c.mode,
        thumbnail: c.thumbnail,
        instructor: c.instructor,
        instructorName: c.instructor?.name || c.instructorName || "CT Faculty",
        isActive: c.isActive,
        isPublished: c.isPublished,
        rating: c.rating,
        seatsAvailable: c.seatsAvailable,
        modulesCount: c.modules?.length || 0,
        lessonsCount: totalLessons,
        enrolledCount,
        modules: c.modules || [],
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      instructorId,
      instructorName,
      price,
      duration,
      mode,
      subjects,
      thumbnail,
      seatsAvailable,
      isPublished = true,
      modules = [],
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let teacherObj = null;
    let finalInstructorName = instructorName || "CT Senior Faculty";
    if (instructorId) {
      teacherObj = await User.findById(instructorId);
      if (teacherObj) finalInstructorName = teacherObj.name;
    }

    const course = await Course.create({
      title,
      description,
      category: category || "Web Development",
      level: level || "Beginner",
      instructor: instructorId || null,
      instructorName: finalInstructorName,
      price: price !== undefined ? Number(price) : 19999,
      duration: duration || "3 Months",
      mode: mode || "Online",
      subjects: subjects || ["Core Fundamentals", "Hands-on Projects"],
      thumbnail:
        thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      seatsAvailable: seatsAvailable || 30,
      isPublished,
      isActive: true,
      modules:
        modules.length > 0
          ? modules
          : [
              {
                title: "Module 1: Orientation & Basics",
                description: "Getting started with course concepts",
                lessons: [
                  {
                    title: "1.1 Introduction & Overview",
                    description: "High level overview of what you will master in this program.",
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    duration: "15 min",
                    isPublished: true,
                  },
                ],
              },
            ],
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Clean up related enrollments, materials, tests
    await Enrollment.deleteMany({ course: req.params.id });
    await StudyMaterial.deleteMany({ course: req.params.id });
    await Test.deleteMany({ course: req.params.id });

    res.json({ message: "Course and related records deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. ALL RESULTS WITH FILTERS
router.get("/results", async (req, res) => {
  try {
    const { courseId, testId, studentId, search } = req.query;
    const filter = {};

    if (courseId && courseId !== "all") filter.course = courseId;
    if (testId && testId !== "all") filter.test = testId;
    if (studentId && studentId !== "all") filter.student = studentId;

    let results = await TestResult.find(filter)
      .populate("student", "name email profileImage batch")
      .populate("course", "title")
      .populate("test", "title")
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(q) ||
          r.studentEmail?.toLowerCase().includes(q) ||
          r.testTitle?.toLowerCase().includes(q) ||
          r.courseTitle?.toLowerCase().includes(q)
      );
    }

    const courses = await Course.find().select("_id title");
    const tests = await Test.find().select("_id title");

    res.json({ results, courses, tests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. ALL TESTS MANAGEMENT
router.get("/tests", async (req, res) => {
  try {
    const tests = await Test.find()
      .populate("course", "title category")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tests", async (req, res) => {
  try {
    const { title, description, courseId, durationMinutes, totalMarks, passingMarks, questions = [], isPublished = true } = req.body;
    if (!title || !courseId) return res.status(400).json({ message: "Title and Course are required" });

    const test = await Test.create({
      title,
      description: description || "",
      course: courseId,
      createdBy: req.user._id,
      durationMinutes: durationMinutes || 30,
      totalMarks: totalMarks || 50,
      passingMarks: passingMarks || 40,
      questions,
      isPublished,
    });
    res.status(201).json({ message: "Test created", test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/tests/:id", async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test updated", test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/tests/:id", async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. ENROLLMENTS MANAGEMENT
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email phone batch profileImage")
      .populate("course", "title category price thumbnail")
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/enrollments", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "Student and Course are required" });
    }

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: "active",
    });

    res.status(201).json({ message: "Student enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/enrollments/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 9. ANNOUNCEMENTS
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("course", "title")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/announcements", async (req, res) => {
  try {
    const { title, content, targetRole = "all", courseId, isImportant = false } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });

    let courseTitle = "All Courses";
    if (courseId) {
      const c = await Course.findById(courseId);
      if (c) courseTitle = c.title;
    }

    const announcement = await Announcement.create({
      title,
      content,
      targetRole,
      course: courseId || null,
      courseTitle,
      createdBy: req.user._id,
      authorName: req.user.name,
      isImportant,
    });

    res.status(201).json({ message: "Announcement published", announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/announcements/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. REPORTS & SYSTEM SETTINGS
router.get("/reports", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalCourses = await Course.countDocuments({});
    const totalEnrollments = await Enrollment.countDocuments({});
    const completedEnrollments = await Enrollment.countDocuments({ status: "completed" });
    const totalTestAttempts = await TestResult.countDocuments({});
    const passedTests = await TestResult.countDocuments({ passed: true });

    res.json({
      summary: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
        testPassingRate: totalTestAttempts > 0 ? Math.round((passedTests / totalTestAttempts) * 100) : 0,
        totalTestAttempts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
