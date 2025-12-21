import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    batch: {
      type: String,
      enum: ["FSD", "DS", "DSA"],
      required: true,
    },

    // ✅ ADD THIS
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
