import dns from "node:dns";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";
import StudyMaterial from "./models/StudyMaterial.js";
import Test from "./models/Test.js";
import TestResult from "./models/TestResult.js";
import Announcement from "./models/Announcement.js";
import Notification from "./models/Notification.js";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.log("DNS setServers warning:", e.message);
}

const DB_URL =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  "mongodb://127.0.0.1:27017/coaching-center";

async function seed() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await StudyMaterial.deleteMany({});
    await Test.deleteMany({});
    await TestResult.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});

    console.log("Cleared old database records.");

    // 1. Password hashes
    const adminPass = await bcrypt.hash("admin123", 10);
    const teacherPass = await bcrypt.hash("teacher123", 10);
    const studentPass = await bcrypt.hash("student123", 10);

    // 2. Create Users
    const admin = await User.create({
      name: "Pradeep Nigam (Admin)",
      email: "admin@coaching.com",
      password: adminPass,
      role: "admin",
      phone: "+91 98765 43210",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    const teacher1 = await User.create({
      name: "Prof. Suresh Rana",
      email: "suresh.rana@gmail.com",
      password: teacherPass,
      role: "teacher",
      phone: "+91 91234 56780",
      specialization: "Full Stack MERN & System Design",
      bio: "12+ years of software industry & teaching experience. Ex-Tech Lead at Amazon.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    const teacher2 = await User.create({
      name: "Dr. Anjali Tiwari",
      email: "anjali.tiwari@gmail.com",
      password: teacherPass,
      role: "teacher",
      phone: "+91 99887 76655",
      specialization: "Data Structures, Algorithms & AI",
      bio: "Ph.D. in Computer Science. Mentored 5000+ engineers into FAANG & Tier-1 firms.",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    const student1 = await User.create({
      name: "Amit Sharma",
      email: "student@coaching.com",
      password: studentPass,
      role: "student",
      phone: "+91 94520 00112",
      batch: "FSD",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    const student2 = await User.create({
      name: "Neha Verma",
      email: "neha.verma@gmail.com",
      password: studentPass,
      role: "student",
      phone: "+91 88776 65544",
      batch: "DSA",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    const student3 = await User.create({
      name: "Rahul Singh",
      email: "rahul.singh@gmail.com",
      password: studentPass,
      role: "student",
      phone: "+91 97766 55443",
      batch: "DS",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      isActive: true,
    });

    console.log("Users created successfully.");

    // 3. Categories
    const categoriesData = [
      { name: "Web Development", slug: "web-development", description: "Frontend, Backend & Full Stack MERN development", icon: "Code" },
      { name: "Programming & DSA", slug: "programming-dsa", description: "Data Structures, Algorithms & Competitive Coding", icon: "Terminal" },
      { name: "Data Science & AI", slug: "data-science-ai", description: "Python, Machine Learning & Deep Learning", icon: "Cpu" },
      { name: "Mobile App Development", slug: "mobile-development", description: "React Native, Flutter, Android & iOS", icon: "Smartphone" },
      { name: "Cloud & DevOps", slug: "cloud-devops", description: "Docker, Kubernetes, AWS & CI/CD", icon: "Cloud" },
    ];
    await Category.insertMany(categoriesData);
    console.log("Categories created.");

    // 4. Courses with Modules & Lessons
    const course1 = await Course.create({
      title: "Master Full Stack Web Development (MERN)",
      description: "From basics of HTML/CSS/JS to advanced React 19, Node.js, Express, MongoDB, Redux Toolkit, Next.js and Cloud Deployments. Includes 10 industry projects.",
      category: "Web Development",
      level: "All Levels",
      instructor: teacher1._id,
      instructorName: teacher1.name,
      duration: "6 Months",
      price: 24999,
      mode: "Online",
      subjects: ["React 19", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT Auth", "REST APIs"],
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      batchStartDate: new Date("2026-11-01"),
      seatsAvailable: 35,
      rating: 4.9,
      totalRatings: 184,
      isPublished: true,
      isActive: true,
      modules: [
        {
          title: "Module 1: Modern JavaScript & Frontend Foundation",
          description: "ES6+, Async/Await, DOM manipulation, Clean Code practices.",
          order: 1,
          lessons: [
            {
              title: "1.1 Welcome & Full Stack Roadmap 2026",
              description: "Overview of modern web architecture and course journey.",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "18 min",
              order: 1,
              isPublished: true,
              resources: [
                { title: "Course Syllabus PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "PDF" },
                { title: "JavaScript Cheatsheet", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "Link" },
              ],
            },
            {
              title: "1.2 JavaScript Deep Dive: Closures & Event Loop",
              description: "Understand JS engine under the hood, microtasks vs macrotasks.",
              videoUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ",
              duration: "24 min",
              order: 2,
              isPublished: true,
              resources: [
                { title: "Event Loop Architecture Diagram", url: "https://javascript.info", type: "Link" },
              ],
            },
            {
              title: "1.3 Asynchronous JS: Promises & Async/Await",
              description: "Handling asynchronous operations with error handling.",
              videoUrl: "https://www.youtube.com/embed/PoRJizFvM7s",
              duration: "20 min",
              order: 3,
              isPublished: true,
              resources: [],
            },
          ],
        },
        {
          title: "Module 2: React 19 Mastery & State Management",
          description: "Components, Hooks, Context API, Performance optimization.",
          order: 2,
          lessons: [
            {
              title: "2.1 React 19 Core Hooks & Custom Hooks",
              description: "useState, useEffect, useMemo, useCallback and custom hooks.",
              videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
              duration: "30 min",
              order: 1,
              isPublished: true,
              resources: [
                { title: "React Component Patterns Handbook", url: "https://react.dev", type: "PDF" },
              ],
            },
            {
              title: "2.2 Client-Side Routing with React Router v7",
              description: "Dynamic params, nested routes, loaders, and protected auth guards.",
              videoUrl: "https://www.youtube.com/embed/Ul3y1LXxzdU",
              duration: "26 min",
              order: 2,
              isPublished: true,
              resources: [],
            },
          ],
        },
        {
          title: "Module 3: Backend Scalability with Node & MongoDB",
          description: "RESTful architecture, Mongoose schemas, JWT Authentication, and Security.",
          order: 3,
          lessons: [
            {
              title: "3.1 Express Server Setup & Architecture",
              description: "Layered architecture, controllers, services, middleware.",
              videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
              duration: "28 min",
              order: 1,
              isPublished: true,
              resources: [
                { title: "Express Production Checklist", url: "https://expressjs.com", type: "PDF" },
              ],
            },
            {
              title: "3.2 JWT Authentication & Role-Based Access Control (RBAC)",
              description: "Token issuance, refresh tokens, role middleware implementation.",
              videoUrl: "https://www.youtube.com/embed/mbsmsi7l3r4",
              duration: "35 min",
              order: 2,
              isPublished: true,
              resources: [],
            },
          ],
        },
      ],
    });

    const course2 = await Course.create({
      title: "Data Structures & Algorithms Masterclass for Interviews",
      description: "Crack product company and FAANG coding interviews with 300+ handpicked DSA problems in C++ and Java. Time and Space complexity mastery.",
      category: "Programming & DSA",
      level: "Intermediate",
      instructor: teacher2._id,
      instructorName: teacher2.name,
      duration: "4 Months",
      price: 19999,
      mode: "Online",
      subjects: ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Bit Manipulation"],
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
      batchStartDate: new Date("2026-11-15"),
      seatsAvailable: 40,
      rating: 5.0,
      totalRatings: 142,
      isPublished: true,
      isActive: true,
      modules: [
        {
          title: "Module 1: Complexity Analysis & Two Pointers",
          description: "Big-O, Sliding Window, Two Pointer strategies.",
          order: 1,
          lessons: [
            {
              title: "1.1 Time & Space Complexity Masterclass",
              description: "Master asymptotic notations, recursive space analysis.",
              videoUrl: "https://www.youtube.com/embed/FPu9Uld7W-E",
              duration: "25 min",
              order: 1,
              isPublished: true,
              resources: [
                { title: "Big-O CheatSheet PDF", url: "https://www.bigocheatsheet.com", type: "PDF" },
              ],
            },
            {
              title: "1.2 Sliding Window & Two Pointers Top Patterns",
              description: "Solving 15 classic interview problems step-by-step.",
              videoUrl: "https://www.youtube.com/embed/MK-NZ4hN7qc",
              duration: "32 min",
              order: 2,
              isPublished: true,
              resources: [],
            },
          ],
        },
        {
          title: "Module 2: Dynamic Programming Demystified",
          description: "Memoization, Tabulation, 1D & 2D DP problems.",
          order: 2,
          lessons: [
            {
              title: "2.1 DP from Recursion Tree to Tabulation",
              description: "0/1 Knapsack, Longest Common Subsequence, Grid paths.",
              videoUrl: "https://www.youtube.com/embed/oBt53YbR9Kk",
              duration: "45 min",
              order: 1,
              isPublished: true,
              resources: [
                { title: "50 Must-Do DP Problems List", url: "https://leetcode.com", type: "PDF" },
              ],
            },
          ],
        },
      ],
    });

    const course3 = await Course.create({
      title: "Python for Data Science & Machine Learning Bootcamp",
      description: "Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, TensorFlow, and build predictive machine learning models with real-world datasets.",
      category: "Data Science & AI",
      level: "Beginner",
      instructor: teacher2._id,
      instructorName: teacher2.name,
      duration: "5 Months",
      price: 22000,
      mode: "Hybrid",
      subjects: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Model Evaluation"],
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      batchStartDate: new Date("2026-11-20"),
      seatsAvailable: 25,
      rating: 4.8,
      totalRatings: 96,
      isPublished: true,
      isActive: true,
      modules: [
        {
          title: "Module 1: Python Data Science Stack",
          description: "NumPy vectorization, Pandas DataFrames, Exploratory Data Analysis.",
          order: 1,
          lessons: [
            {
              title: "1.1 NumPy & Pandas for High Performance Data Wrangling",
              description: "Array indexing, filtering, groupby, and data cleaning.",
              videoUrl: "https://www.youtube.com/embed/vmEHCJofslg",
              duration: "35 min",
              order: 1,
              isPublished: true,
              resources: [],
            },
          ],
        },
      ],
    });

    console.log("Courses created.");

    // 5. Enrollments
    const lesson1Id = course1.modules[0].lessons[0]._id.toString();
    const lesson2Id = course1.modules[0].lessons[1]._id.toString();
    const lesson3Id = course1.modules[0].lessons[2]._id.toString();

    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      progress: 67,
      completedLessons: [lesson1Id, lesson2Id],
      status: "active",
      enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    });

    await Enrollment.create({
      student: student1._id,
      course: course2._id,
      progress: 33,
      completedLessons: [course2.modules[0].lessons[0]._id.toString()],
      status: "active",
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    await Enrollment.create({
      student: student2._id,
      course: course2._id,
      progress: 100,
      completedLessons: [
        course2.modules[0].lessons[0]._id.toString(),
        course2.modules[0].lessons[1]._id.toString(),
        course2.modules[1].lessons[0]._id.toString(),
      ],
      status: "completed",
      completedAt: new Date(),
      enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });

    await Enrollment.create({
      student: student3._id,
      course: course1._id,
      progress: 40,
      completedLessons: [lesson1Id],
      status: "active",
    });

    console.log("Enrollments created.");

    // 6. Study Materials
    await StudyMaterial.create([
      {
        title: "Complete React 19 & Next.js Cheat Sheet",
        description: "Comprehensive handbook covering hooks, state machines, server components, and performance.",
        course: course1._id,
        uploadedBy: teacher1._id,
        authorName: teacher1.name,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "PDF",
        fileSize: "3.4 MB",
        tags: ["React", "Frontend", "Handwritten Notes"],
        isPublished: true,
      },
      {
        title: "MERN Stack REST API Security Best Practices",
        description: "Sanitization, rate limiting, JWT token expiry strategies, and CORS headers guide.",
        course: course1._id,
        uploadedBy: teacher1._id,
        authorName: teacher1.name,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "PDF",
        fileSize: "2.1 MB",
        tags: ["Security", "Node.js", "Express"],
        isPublished: true,
      },
      {
        title: "Top 75 LeetCode Patterns with Visual Diagrams",
        description: "Curated problem patterns for fast recall during technical whiteboard interviews.",
        course: course2._id,
        uploadedBy: teacher2._id,
        authorName: teacher2.name,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "PDF",
        fileSize: "5.8 MB",
        tags: ["DSA", "Interview Prep", "Algorithms"],
        isPublished: true,
      },
      {
        title: "Python Pandas & NumPy Quick Reference Guide",
        description: "Essential data manipulation functions, methods, and syntax cheat sheet.",
        course: course3._id,
        uploadedBy: teacher2._id,
        authorName: teacher2.name,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "PDF",
        fileSize: "1.9 MB",
        tags: ["Python", "Pandas", "Data Science"],
        isPublished: true,
      },
    ]);

    console.log("Study Materials created.");

    // 7. Tests & Quizzes
    const test1 = await Test.create({
      title: "React Fundamentals & State Architecture Quiz",
      description: "Test your understanding of React 19 state updates, useEffect dependency arrays, custom hooks, and virtual DOM diffing.",
      course: course1._id,
      createdBy: teacher1._id,
      durationMinutes: 20,
      totalMarks: 50,
      passingMarks: 30,
      isPublished: true,
      questions: [
        {
          questionText: "Which hook is best suited for memoizing the result of an expensive calculation in React?",
          options: ["useCallback", "useMemo", "useRef", "useReducer"],
          correctAnswer: 1,
          marks: 10,
          explanation: "useMemo stores and recomputes memoized values only when specified dependencies change.",
        },
        {
          questionText: "What does the Virtual DOM in React allow for?",
          options: [
            "Direct manipulation of browser history",
            "Batching and calculating minimal actual DOM updates",
            "Running C++ code in the browser",
            "Bypassing CSS cascading rules",
          ],
          correctAnswer: 1,
          marks: 10,
          explanation: "React diffs Virtual DOM trees and performs reconciled batch updates to minimize expensive real DOM operations.",
        },
        {
          questionText: "What is the primary purpose of keys in React list rendering?",
          options: [
            "To style elements uniquely",
            "To help React identify which items have changed, been added, or removed",
            "To encrypt component state",
            "To pass secret tokens between components",
          ],
          correctAnswer: 1,
          marks: 10,
          explanation: "Keys provide a stable identity to elements across renders for fast reconciliation.",
        },
        {
          questionText: "Which of the following is true about React state updates?",
          options: [
            "State updates in event handlers are automatically batched",
            "State updates immediately mutate this.state synchronously",
            "State can only be updated from parent components",
            "State cannot hold nested objects",
          ],
          correctAnswer: 0,
          marks: 10,
          explanation: "React batches multiple state updates inside handlers for optimal performance.",
        },
        {
          questionText: "In the MERN stack, what does the 'E' stand for?",
          options: ["Electron", "Elasticsearch", "Express.js", "Ember.js"],
          correctAnswer: 2,
          marks: 10,
          explanation: "MERN stands for MongoDB, Express.js, React, Node.js.",
        },
      ],
    });

    const test2 = await Test.create({
      title: "Data Structures & Time Complexity Assessment",
      description: "Comprehensive test covering asymptotic notation, array manipulations, hash maps, and recursion depth.",
      course: course2._id,
      createdBy: teacher2._id,
      durationMinutes: 25,
      totalMarks: 40,
      passingMarks: 25,
      isPublished: true,
      questions: [
        {
          questionText: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
          correctAnswer: 1,
          marks: 10,
          explanation: "In a balanced BST, each comparison halves the search space, giving O(log N) time.",
        },
        {
          questionText: "Which data structure follows the LIFO (Last In First Out) principle?",
          options: ["Queue", "Stack", "Priority Queue", "Linked List"],
          correctAnswer: 1,
          marks: 10,
          explanation: "Stack elements are pushed and popped from the same end, following LIFO.",
        },
        {
          questionText: "What is the worst-case time complexity of QuickSort?",
          options: ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"],
          correctAnswer: 1,
          marks: 10,
          explanation: "When the pivot chosen is consistently the smallest or largest element, QuickSort degrades to O(N^2).",
        },
        {
          questionText: "Which algorithmic paradigm does the Merge Sort algorithm employ?",
          options: ["Greedy Approach", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
          correctAnswer: 2,
          marks: 10,
          explanation: "Merge sort divides the array in halves, recursively sorts them, and merges the sorted halves.",
        },
      ],
    });

    console.log("Tests created.");

    // 8. Test Results (for student1)
    await TestResult.create({
      test: test1._id,
      testTitle: test1.title,
      student: student1._id,
      studentName: student1.name,
      studentEmail: student1.email,
      course: course1._id,
      courseTitle: course1.title,
      score: 40,
      totalMarks: 50,
      percentage: 80,
      passed: true,
      timeSpentSeconds: 780,
      answers: [
        { questionId: test1.questions[0]._id.toString(), questionText: test1.questions[0].questionText, selectedOption: 1, correctAnswer: 1, isCorrect: true, marksAwarded: 10 },
        { questionId: test1.questions[1]._id.toString(), questionText: test1.questions[1].questionText, selectedOption: 1, correctAnswer: 1, isCorrect: true, marksAwarded: 10 },
        { questionId: test1.questions[2]._id.toString(), questionText: test1.questions[2].questionText, selectedOption: 1, correctAnswer: 1, isCorrect: true, marksAwarded: 10 },
        { questionId: test1.questions[3]._id.toString(), questionText: test1.questions[3].questionText, selectedOption: 0, correctAnswer: 0, isCorrect: true, marksAwarded: 10 },
        { questionId: test1.questions[4]._id.toString(), questionText: test1.questions[4].questionText, selectedOption: 1, correctAnswer: 2, isCorrect: false, marksAwarded: 0 },
      ],
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // 9. Announcements
    await Announcement.create([
      {
        title: "🚀 Special Masterclass on System Design & Microservices this Saturday",
        content: "Join Ex-Amazon Principal Architect for an exclusive live 3-hour deep dive into high-throughput distributed systems, Kafka queues, and Redis caching.",
        targetRole: "all",
        courseTitle: "All Courses",
        createdBy: admin._id,
        authorName: "CT Administration",
        isImportant: true,
      },
      {
        title: "📚 New Study Material uploaded for React 19 Architecture",
        content: "Prof. Suresh Rana has uploaded the complete handwritten notes and starter code repositories in the Study Materials section.",
        targetRole: "student",
        course: course1._id,
        courseTitle: course1.title,
        createdBy: teacher1._id,
        authorName: teacher1.name,
        isImportant: false,
      },
      {
        title: "Faculty Meeting: Mid-Semester Curriculum Review",
        content: "All teaching staff are requested to join the curriculum review conference on Friday at 4:00 PM.",
        targetRole: "teacher",
        createdBy: admin._id,
        authorName: "Dean of Academics",
        isImportant: false,
      },
    ]);

    // 10. Notifications
    await Notification.create([
      {
        recipient: student1._id,
        title: "Quiz Result Published",
        message: "You scored 40/50 (80%) on React Fundamentals Quiz. Great performance!",
        type: "success",
        link: "/student/results",
        read: false,
      },
      {
        recipient: student1._id,
        title: "Upcoming Live Session Tomorrow",
        message: "Live Doubt Clearing: React State Management starts tomorrow at 5:00 PM.",
        type: "info",
        link: "/student/dashboard",
        read: false,
      },
    ]);

    console.log("Seeding finished successfully!");
    console.log("\n===========================================");
    console.log("DEMO ACCOUNTS READY TO USE:");
    console.log("-------------------------------------------");
    console.log("Admin:    admin@coaching.com    / admin123");
    console.log("Teacher:  suresh.rana@gmail.com / teacher123");
    console.log("Teacher:  anjali.tiwari@gmail.com / teacher123");
    console.log("Student:  student@coaching.com  / student123");
    console.log("===========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
