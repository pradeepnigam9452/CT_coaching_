import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number, // index 0, 1, 2, 3
    required: true,
    default: 0,
  },
  marks: {
    type: Number,
    default: 5,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    durationMinutes: {
      type: Number,
      default: 30, // 30 mins
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Test || mongoose.model("Test", testSchema);
