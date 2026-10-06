import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0, // 0 to 100
    },
    completedLessons: [
      {
        type: String, // lesson _id as string
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Ensure a student can only enroll once per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
