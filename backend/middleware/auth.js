// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // user info available in routes
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authMiddleware;


import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ user exists?
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️⃣ password match?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ CREATE TOKEN 👇 (THIS IS THE CODE YOU ASKED)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ send token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;
