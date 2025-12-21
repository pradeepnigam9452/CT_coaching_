// this updated backend we need to change path in frontend 
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import studentRoutes from "./routes/student.routes.js";
import courseRoutes from "./routes/course.routes.js"
import authRoutes from "./routes/auth.routes.js"

import logger from "./middleware/logger.js";

const app = express();
app.use(logger) // this is middleware it will run  every  api call
app.use(cors());
app.use(express.json());
 const DB_URL = "mongodb://127.0.0.1:27017/coaching-center";
main();
async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected");
  } catch (e) {
    console.log(e);
  }
}

// students base route
app.use("/api/students", studentRoutes);
app.use("/api/course" , courseRoutes);
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});





















// -----------------------here backend before updations (ROutes )

// import express from "express";
// import bcrypt from 'bcrypt'
// import mongoose from "mongoose";
// import cors from "cors";
// import Student from "./models/Student.js";
// import Course from "./models/Course.js";
// import Auth from "./models/Auth.js";
// const PORT = 3000;
// const app = express();
// app.use(cors());
// app.use(express.json());
// import dotenv from "dotenv";
// dotenv.config();
// // for Data base
// const DB_URL = "mongodb://127.0.0.1:27017/coaching-center";
// main();
// async function main() {
//   try {
//     await mongoose.connect(DB_URL);
//     console.log("Database connected");
//   } catch (e) {
//     console.log(e);
//   }
// }
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // for student info
// app.get("/api/student",  async (req, res) => {
//   const data = await Student.find({});
//   res.json(data);
// });

// app.post("/api/addstudent", async (req, res) => {
//   try {
//     const { name, email, batch, role } = req.body;
//     const user = await Student.create({
//       name,
//       email,
//       batch,
//       role,
//     });
//     // res.redirect("/api/student");
//     res.status(201).json({
//   message: "Student added successfully",
//   user,
// });

//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send(error.message);
//   }
// });

// // for course info
// app.get("/course", async (req, res) => {
//   const data = await Course.find({});
//   res.json(data);
// });

// app.get("/course/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await Course.findById(id);
//     if (!data) {
//       return res.status(404).json({ error: "course not found " });
//     }
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/addcourse", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       duration,
//       price,
//       mode,
//       subject,
//       batchStartDate,
//       seatsAvailable,
//       isActive,
//     } = req.body;
//     if (!title || !price || !duration) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     const data = await Course.create({
//       title,
//       description,
//       duration,
//       price,
//       mode,
//       subject,
//       batchStartDate,
//       seatsAvailable,
//       isActive,
//     });

//     res.status(201).json({
//       message: "Course added successfully",
//       data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to add course",
//       error: error.message,
//     });
//   }
// });

// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters" });
//     }
//     const existingUser = await Auth.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await Auth.create({
//       name,
//       email,
//       password: hashedPassword,
//       // role: role || "student",
//     });
//     res.status(201).json({
//       message: "Signup successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         // role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Signup failed", error: error.message });
//   }
// });

// app.listen(PORT);
