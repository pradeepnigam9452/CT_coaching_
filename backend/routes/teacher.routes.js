import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import StudyMaterial from "../models/StudyMaterial.js";
import Test from "../models/Test.js";
import TestResult from "../models/TestResult.js";
import User from "../models/User.js";

const router = express.Router();

// Apply auth & teacher role
router.use(protect);
router.use(authorize("teacher", "admin"));

// Helper: Get courses assigned to this teacher (or all courses if admin)
const getTeacherCoursesQuery = (req) => {
  if (req.user.role === "admin") return {};
  return {
    $or: [{ instructor: req.user._id }, { instructorName: req.user.name }],
  };
};

// 1. TEACHER DASHBOARD OVERVIEW
router.get("/dashboard", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const teacherCourses = await Course.find(courseQuery);
    const teacherCourseIds = teacherCourses.map((c) => c._id);

    const assignedCoursesCount = teacherCourses.length;
    const activeCoursesCount = teacherCourses.filter((c) => c.isActive && c.isPublished).length;

    // Total enrolled students across teacher's courses
    const enrollments = await Enrollment.find({
      course: { $in: teacherCourseIds },
    })
      .populate("student", "name email profileImage batch")
      .populate("course", "title")
      .sort({ updatedAt: -1 });

    const uniqueStudentIds = new Set(enrollments.map((e) => e.student?._id?.toString()).filter(Boolean));
    const totalStudents = uniqueStudentIds.size;

    // Tests created
    const testsCreated = await Test.countDocuments({
      course: { $in: teacherCourseIds },
    });

    // Recent results submitted by students
    const recentResults = await TestResult.find({
      course: { $in: teacherCourseIds },
    })
      .sort({ createdAt: -1 })
      .limit(6);

    // Course performance summary
    const coursePerformance = teacherCourses.map((c) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course?._id?.toString() === c._id.toString()
      );
      const avgProgress = courseEnrollments.length > 0
        ? Math.round(
            courseEnrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
              courseEnrollments.length
          )
        : 0;

      return {
        id: c._id,
        title: c.title,
        studentsCount: courseEnrollments.length,
        avgProgress,
        category: c.category,
      };
    });

    res.json({
      metrics: {
        assignedCourses: assignedCoursesCount,
        totalStudents: totalStudents || enrollments.length,
        activeCourses: activeCoursesCount,
        testsCreated,
      },
      recentActivity: enrollments.slice(0, 6).map((e) => ({
        id: e._id,
        studentName: e.student?.name || "Student",
        studentEmail: e.student?.email,
        courseTitle: e.course?.title || "Course",
        progress: e.progress,
        date: e.updatedAt,
      })),
      recentResults,
      coursePerformance,
      upcomingClasses: [
        {
          id: "t-cls-1",
          title: "Advanced DSA & Dynamic Programming Class",
          time: "Today, 4:00 PM - 5:30 PM",
          course: "Data Structures & Algorithms",
          attendeesCount: 28,
        },
        {
          id: "t-cls-2",
          title: "React Server Components Deep Dive",
          time: "Tomorrow, 6:00 PM - 7:30 PM",
          course: "Full Stack Web Development",
          attendeesCount: 35,
        },
      ],
    });
  } catch (error) {
    console.error("Teacher Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. TEACHER COURSES
router.get("/courses", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const courses = await Course.find(courseQuery).sort({ createdAt: -1 });

    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const formatted = courses.map((c) => {
      const studentCount = enrollments.filter(
        (e) => e.course.toString() === c._id.toString()
      ).length;

      let totalLessons = 0;
      c.modules?.forEach((m) => {
        totalLessons += m.lessons?.length || 0;
      });

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
        isActive: c.isActive,
        isPublished: c.isPublished,
        modulesCount: c.modules?.length || 0,
        lessonsCount: totalLessons,
        enrolledStudentsCount: studentCount,
        modules: c.modules || [],
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. ADD MODULE TO COURSE
router.post("/courses/:courseId/modules", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Module title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules.push({
      title,
      description: description || "",
      order: course.modules.length + 1,
      lessons: [],
    });

    await course.save();
    res.status(201).json({ message: "Module added successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. GET ALL LESSONS
router.get("/lessons", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const courses = await Course.find(courseQuery);

    const lessonsList = [];
    courses.forEach((c) => {
      c.modules?.forEach((m) => {
        m.lessons?.forEach((l) => {
          lessonsList.push({
            _id: l._id,
            title: l.title,
            description: l.description,
            videoUrl: l.videoUrl,
            duration: l.duration,
            isPublished: l.isPublished,
            resources: l.resources || [],
            courseId: c._id,
            courseTitle: c.title,
            moduleId: m._id,
            moduleTitle: m.title,
          });
        });
      });
    });

    res.json(lessonsList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. CREATE LESSON
router.post("/lessons", async (req, res) => {
  try {
    const {
      courseId,
      moduleId,
      title,
      description,
      videoUrl,
      duration,
      isPublished = true,
      resources = [],
    } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ message: "Course and Lesson title are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let targetModule = null;
    if (moduleId) {
      targetModule = course.modules.id(moduleId);
    }

    // If no module specified or found, use first module or create one
    if (!targetModule) {
      if (course.modules.length === 0) {
        course.modules.push({
          title: "Module 1: Getting Started",
          lessons: [],
        });
      }
      targetModule = course.modules[0];
    }

    targetModule.lessons.push({
      title,
      description: description || "",
      videoUrl: videoUrl || "",
      duration: duration || "15 min",
      isPublished,
      resources,
      order: targetModule.lessons.length + 1,
    });

    await course.save();

    res.status(201).json({
      message: "Lesson created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. DELETE LESSON
router.delete("/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.query;

    let courses = [];
    if (courseId) {
      const c = await Course.findById(courseId);
      if (c) courses.push(c);
    } else {
      courses = await Course.find(getTeacherCoursesQuery(req));
    }

    let removed = false;
    for (const course of courses) {
      for (const mod of course.modules) {
        const lesson = mod.lessons.id(id);
        if (lesson) {
          lesson.deleteOne();
          await course.save();
          removed = true;
          break;
        }
      }
      if (removed) break;
    }

    if (!removed) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. TEACHER STUDY MATERIALS
router.get("/materials", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const teacherCourses = await Course.find(courseQuery).select("_id title");
    const courseIds = teacherCourses.map((c) => c._id);

    const materials = await StudyMaterial.find({
      $or: [{ uploadedBy: req.user._id }, { course: { $in: courseIds } }],
    })
      .populate("course", "title category")
      .sort({ createdAt: -1 });

    res.json({ materials, courses: teacherCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/materials", async (req, res) => {
  try {
    const { title, description, courseId, fileUrl, fileType, fileSize, tags } = req.body;

    if (!title || !courseId || !fileUrl) {
      return res.status(400).json({ message: "Title, Course, and File URL are required" });
    }

    const material = await StudyMaterial.create({
      title,
      description: description || "",
      course: courseId,
      uploadedBy: req.user._id,
      authorName: req.user.name,
      fileUrl,
      fileType: fileType || "PDF",
      fileSize: fileSize || "1.8 MB",
      tags: tags || [],
    });

    res.status(201).json({ message: "Study material added successfully", material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/materials/:id", async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. TEACHER TESTS & QUIZZES
router.get("/tests", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const teacherCourses = await Course.find(courseQuery).select("_id title");
    const courseIds = teacherCourses.map((c) => c._id);

    const tests = await Test.find({
      $or: [{ createdBy: req.user._id }, { course: { $in: courseIds } }],
    })
      .populate("course", "title category")
      .sort({ createdAt: -1 });

    res.json({ tests, courses: teacherCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tests", async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      durationMinutes,
      totalMarks,
      passingMarks,
      questions = [],
      isPublished = true,
    } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: "Title and Course are required" });
    }

    const test = await Test.create({
      title,
      description: description || "",
      course: courseId,
      createdBy: req.user._id,
      durationMinutes: durationMinutes || 30,
      totalMarks: totalMarks || questions.length * 5 || 50,
      passingMarks: passingMarks || 40,
      questions,
      isPublished,
    });

    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/tests/:id", async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json({ message: "Test updated successfully", test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/tests/:id", async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 9. TEACHER STUDENTS (Only students enrolled in teacher's assigned courses)
router.get("/students", async (req, res) => {
  try {
    const courseQuery = getTeacherCoursesQuery(req);
    const teacherCourses = await Course.find(courseQuery).select("_id title");
    const courseIds = teacherCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "name email phone batch profileImage isActive")
      .populate("course", "title category")
      .sort({ updatedAt: -1 });

    const studentMap = {};
    for (const enr of enrollments) {
      if (!enr.student) continue;
      const sId = enr.student._id.toString();

      if (!studentMap[sId]) {
        // Find tests completed by student
        const studentTests = await TestResult.find({ student: enr.student._id });
        const avgScore = studentTests.length > 0
          ? Math.round(
              studentTests.reduce((acc, r) => acc + (r.percentage || 0), 0) /
                studentTests.length
            )
          : 0;

        studentMap[sId] = {
          _id: enr.student._id,
          name: enr.student.name,
          email: enr.student.email,
          phone: enr.student.phone || "—",
          batch: enr.student.batch,
          profileImage: enr.student.profileImage,
          isActive: enr.student.isActive,
          courses: [],
          testsCompleted: studentTests.length,
          avgScore,
          lastActivity: enr.updatedAt,
        };
      }

      studentMap[sId].courses.push({
        courseId: enr.course?._id,
        courseTitle: enr.course?.title || "Course",
        progress: enr.progress,
        status: enr.status,
      });
    }

    res.json(Object.values(studentMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. TEACHER RESULTS
router.get("/results", async (req, res) => {
  try {
    const { courseId, testId, search } = req.query;
    const courseQuery = getTeacherCoursesQuery(req);
    const teacherCourses = await Course.find(courseQuery).select("_id title");
    const courseIds = teacherCourses.map((c) => c._id);

    const filter = { course: { $in: courseIds } };
    if (courseId && courseId !== "all") filter.course = courseId;
    if (testId && testId !== "all") filter.test = testId;

    let results = await TestResult.find(filter)
      .populate("student", "name email profileImage batch")
      .populate("test", "title")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(q) ||
          r.studentEmail?.toLowerCase().includes(q) ||
          r.testTitle?.toLowerCase().includes(q)
      );
    }

    res.json({ results, courses: teacherCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
