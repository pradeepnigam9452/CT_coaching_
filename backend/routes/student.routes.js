import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import StudyMaterial from "../models/StudyMaterial.js";
import Test from "../models/Test.js";
import TestResult from "../models/TestResult.js";
import Announcement from "../models/Announcement.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const router = express.Router();

// Apply auth & student role to all student routes
router.use(protect);
router.use(authorize("student"));

// 1. STUDENT DASHBOARD OVERVIEW
router.get("/dashboard", async (req, res) => {
  try {
    const studentId = req.user._id;

    // Enrollments
    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course")
      .sort({ updatedAt: -1 });

    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.progress >= 100 || e.status === "completed"
    ).length;
    const inProgressCourses = totalEnrolled - completedCourses;

    // Most recent active course for "Continue Learning"
    let continueLearning = null;
    const activeEnrollment = enrollments.find((e) => e.progress < 100) || enrollments[0];
    if (activeEnrollment && activeEnrollment.course) {
      const course = activeEnrollment.course;
      let totalLessons = 0;
      course.modules?.forEach((m) => {
        totalLessons += m.lessons?.length || 0;
      });
      continueLearning = {
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        instructorName: course.instructorName || "CT Faculty",
        progress: activeEnrollment.progress || 0,
        completedLessonsCount: activeEnrollment.completedLessons?.length || 0,
        totalLessonsCount: totalLessons,
        category: course.category,
      };
    }

    // Test Results
    const testResults = await TestResult.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(5);

    const testsCompleted = await TestResult.countDocuments({ student: studentId });
    const allResults = await TestResult.find({ student: studentId }).select("percentage");
    const averageScore = allResults.length > 0
      ? Math.round(allResults.reduce((acc, r) => acc + (r.percentage || 0), 0) / allResults.length)
      : 0;

    // Upcoming Tests (Tests in enrolled courses that student hasn't taken yet)
    const enrolledCourseIds = enrollments
      .map((e) => e.course?._id)
      .filter(Boolean);

    const takenTestIds = (await TestResult.find({ student: studentId }).select("test")).map(
      (r) => r.test.toString()
    );

    const upcomingTests = await Test.find({
      course: { $in: enrolledCourseIds },
      _id: { $nin: takenTestIds },
      isPublished: true,
    })
      .populate("course", "title")
      .limit(3);

    // Announcements
    const announcements = await Announcement.find({
      targetRole: { $in: ["all", "student"] },
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      student: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage,
        batch: req.user.batch,
      },
      metrics: {
        totalEnrolled,
        completedCourses,
        inProgressCourses,
        testsCompleted,
        averageScore,
      },
      continueLearning,
      recentResults: testResults,
      upcomingTests,
      announcements,
      upcomingClasses: [
        {
          id: "cls-1",
          title: "Live Doubt Clearing: React State Management",
          date: "Tomorrow, 5:00 PM - 6:30 PM",
          instructor: "Prof. Suresh Rana",
          link: "https://meet.google.com",
          mode: "Online Live",
        },
        {
          id: "cls-2",
          title: "System Design & Node.js Scalability Workshop",
          date: "Saturday, 11:00 AM",
          instructor: "Prof. Anjali Tiwari",
          link: "https://meet.google.com",
          mode: "Online Live",
        },
      ],
    });
  } catch (error) {
    console.error("Student Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. GET MY ENROLLED COURSES
router.get("/courses", async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email profileImage" },
      })
      .sort({ updatedAt: -1 });

    const coursesData = enrollments
      .filter((e) => e.course)
      .map((enrollment) => {
        const course = enrollment.course;
        let totalLessons = 0;
        course.modules?.forEach((m) => {
          totalLessons += m.lessons?.length || 0;
        });

        return {
          enrollmentId: enrollment._id,
          courseId: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          level: course.level,
          instructorName: course.instructor?.name || course.instructorName || "Faculty Instructor",
          duration: course.duration,
          progress: enrollment.progress || 0,
          completedLessons: enrollment.completedLessons?.length || 0,
          totalLessons: totalLessons || 10,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
        };
      });

    res.json(coursesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. BROWSE ALL COURSES
router.get("/browse-courses", async (req, res) => {
  try {
    const { search, category, level, sort } = req.query;
    const query = { isPublished: true, isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subjects: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (level && level !== "All") {
      query.level = level;
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price-low") sortObj = { price: 1 };
    if (sort === "price-high") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { rating: -1 };

    const courses = await Course.find(query)
      .populate("instructor", "name profileImage")
      .sort(sortObj);

    // Get user's enrolled course IDs
    const myEnrollments = await Enrollment.find({ student: req.user._id }).select("course");
    const enrolledSet = new Set(myEnrollments.map((e) => e.course.toString()));

    const result = courses.map((course) => {
      let totalLessons = 0;
      course.modules?.forEach((m) => {
        totalLessons += m.lessons?.length || 0;
      });

      return {
        id: course._id,
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        price: course.price,
        duration: course.duration,
        mode: course.mode,
        thumbnail: course.thumbnail,
        rating: course.rating || 4.8,
        totalRatings: course.totalRatings || 24,
        totalLessons: totalLessons || 12,
        seatsAvailable: course.seatsAvailable,
        instructorName: course.instructor?.name || course.instructorName || "Prof. CT Coaching",
        isEnrolled: enrolledSet.has(course._id.toString()),
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. ENROLL IN A COURSE
router.post("/enroll/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (enrollment) {
      return res.json({
        message: "You are already enrolled in this course",
        enrollment,
      });
    }

    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: "active",
    });

    // Create a welcome notification
    await Notification.create({
      recipient: studentId,
      title: `Enrolled in ${course.title}`,
      message: `Congratulations! You have successfully enrolled in ${course.title}. Start learning today!`,
      type: "course",
      link: `/student/learning/${courseId}`,
    });

    res.status(201).json({
      message: "Successfully enrolled in course!",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. GET LEARNING CLASSROOM DATA
router.get("/learning/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId).populate(
      "instructor",
      "name email profileImage bio"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find or automatically create enrollment if student wants to test learning
    let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        progress: 0,
        completedLessons: [],
      });
    }

    // Find tests for this course
    const tests = await Test.find({ course: courseId, isPublished: true }).select(
      "_id title durationMinutes totalMarks passingMarks"
    );

    res.json({
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        thumbnail: course.thumbnail,
        instructor: course.instructor || {
          name: course.instructorName || "Faculty Instructor",
        },
        modules: course.modules || [],
      },
      enrollment: {
        progress: enrollment.progress || 0,
        completedLessons: enrollment.completedLessons || [],
        status: enrollment.status,
      },
      tests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. TOGGLE / MARK LESSON AS COMPLETED
router.post("/learning/:courseId/complete-lesson", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;
    const studentId = req.user._id;

    if (!lessonId) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let totalLessons = 0;
    course.modules?.forEach((m) => {
      totalLessons += m.lessons?.length || 0;
    });
    if (totalLessons === 0) totalLessons = 1;

    let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      enrollment = new Enrollment({
        student: studentId,
        course: courseId,
        completedLessons: [],
      });
    }

    const lessonIdStr = lessonId.toString();
    const isCompleted = enrollment.completedLessons.includes(lessonIdStr);

    if (isCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id !== lessonIdStr
      );
    } else {
      enrollment.completedLessons.push(lessonIdStr);
    }

    const completedCount = enrollment.completedLessons.length;
    const newProgress = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    enrollment.progress = newProgress;
    if (newProgress === 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    } else {
      enrollment.status = "active";
    }

    await enrollment.save();

    res.json({
      message: isCompleted ? "Lesson marked incomplete" : "Lesson marked complete!",
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      status: enrollment.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. STUDY MATERIALS
router.get("/materials", async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = { isPublished: true };

    if (courseId && courseId !== "all") {
      filter.course = courseId;
    }

    const materials = await StudyMaterial.find(filter)
      .populate("course", "title category")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    // Also return list of enrolled courses for filter dropdown
    const enrollments = await Enrollment.find({ student: req.user._id }).populate(
      "course",
      "title"
    );
    const userCourses = enrollments.map((e) => e.course).filter(Boolean);

    res.json({
      materials,
      courses: userCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. TESTS & QUIZZES LIST
router.get("/tests", async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all enrolled courses
    const enrollments = await Enrollment.find({ student: studentId }).select("course");
    const courseIds = enrollments.map((e) => e.course);

    // Get all published tests in enrolled courses (or all published tests if few enrolled)
    const tests = await Test.find({
      isPublished: true,
      $or: [{ course: { $in: courseIds } }, { isPublished: true }],
    }).populate("course", "title thumbnail");

    // Get attempts by this student
    const studentResults = await TestResult.find({ student: studentId });
    const resultMap = {};
    studentResults.forEach((r) => {
      resultMap[r.test.toString()] = r;
    });

    const formattedTests = tests.map((t) => {
      const result = resultMap[t._id.toString()];
      return {
        _id: t._id,
        id: t._id,
        title: t.title,
        description: t.description,
        courseTitle: t.course?.title || "General Subject",
        courseThumbnail: t.course?.thumbnail,
        durationMinutes: t.durationMinutes,
        totalMarks: t.totalMarks,
        passingMarks: t.passingMarks,
        totalQuestions: t.questions?.length || 0,
        isAttempted: Boolean(result),
        lastScore: result ? result.score : null,
        lastPercentage: result ? result.percentage : null,
        passed: result ? result.passed : null,
      };
    });

    res.json(formattedTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 9. GET SINGLE TEST FOR TAKING (Without leaking correct answers)
router.get("/tests/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("course", "title");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Strip out correctAnswer for test security
    const sanitizedQuestions = test.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    }));

    res.json({
      _id: test._id,
      title: test.title,
      description: test.description,
      courseTitle: test.course?.title || "General",
      durationMinutes: test.durationMinutes,
      totalMarks: test.totalMarks,
      passingMarks: test.passingMarks,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. SUBMIT TEST & INSTANT GRADING
router.post("/tests/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers = {}, timeSpentSeconds = 0 } = req.body;
    const studentId = req.user._id;

    const test = await Test.findById(id).populate("course", "title");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let calculatedScore = 0;
    let totalPossibleMarks = 0;
    const evaluatedAnswers = [];

    test.questions.forEach((q) => {
      const qIdStr = q._id.toString();
      const selectedOpt = answers[qIdStr] !== undefined ? Number(answers[qIdStr]) : -1;
      const isCorrect = selectedOpt === q.correctAnswer;
      const marks = q.marks || 5;

      totalPossibleMarks += marks;
      if (isCorrect) {
        calculatedScore += marks;
      }

      evaluatedAnswers.push({
        questionId: qIdStr,
        questionText: q.questionText,
        selectedOption: selectedOpt,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marksAwarded: isCorrect ? marks : 0,
      });
    });

    if (totalPossibleMarks === 0) totalPossibleMarks = 100;
    const percentage = Math.round((calculatedScore / totalPossibleMarks) * 100);
    const passed = percentage >= (test.passingMarks || 40);

    const testResult = await TestResult.create({
      test: test._id,
      testTitle: test.title,
      student: studentId,
      studentName: req.user.name,
      studentEmail: req.user.email,
      course: test.course?._id || test._id,
      courseTitle: test.course?.title || "Course Test",
      score: calculatedScore,
      totalMarks: totalPossibleMarks,
      percentage,
      passed,
      answers: evaluatedAnswers,
      timeSpentSeconds,
    });

    // Create a result notification
    await Notification.create({
      recipient: studentId,
      title: `Test Completed: ${test.title}`,
      message: `You scored ${calculatedScore}/${totalPossibleMarks} (${percentage}%). Status: ${
        passed ? "PASSED" : "NEEDS IMPROVEMENT"
      }`,
      type: "test",
      link: `/student/results`,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      result: testResult,
    });
  } catch (error) {
    console.error("Test submit error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 11. GET STUDENT RESULTS
router.get("/results", async (req, res) => {
  try {
    const studentId = req.user._id;
    const results = await TestResult.find({ student: studentId })
      .populate("test", "title durationMinutes")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 12. GET NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 13. MARK NOTIFICATION AS READ
router.patch("/notifications/:id/read", async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
