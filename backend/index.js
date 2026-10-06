import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import courseRoutes from "./routes/course.routes.js";
import logger from "./middleware/logger.js";

// Ensure DNS resolvers can query Atlas SRV records reliably on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.log("DNS setServers warning:", e.message);
}

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  "mongodb://127.0.0.1:27017/coaching-center";

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(logger);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CT Coaching Center LMS API",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/courses", courseRoutes);

// Backward compatibility for old student endpoints
app.use("/api/students", async (req, res) => {
  try {
    const User = (await import("./models/User.js")).default;
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

async function start() {
  try {
    await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB Database connected successfully to:", DB_URL.replace(/:([^:@]+)@/, ":****@"));
  } catch (error) {
    console.error("Primary DB connection error:", error.message);
    // If Atlas connection fails, attempt fallback to local MongoDB
    try {
      console.log("Attempting fallback to local MongoDB: mongodb://127.0.0.1:27017/coaching-center");
      await mongoose.connect("mongodb://127.0.0.1:27017/coaching-center");
      console.log("Connected to fallback local MongoDB");
    } catch (fallbackErr) {
      console.error("Fatal DB error:", fallbackErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`CT Coaching LMS Backend running on port ${PORT}`);
  });
}

start();