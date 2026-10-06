import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  questionText: String,
  selectedOption: {
    type: Number, // index or -1 if skipped
    default: -1,
  },
  correctAnswer: Number,
  isCorrect: {
    type: Boolean,
    default: false,
  },
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

const testResultSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    testTitle: {
      type: String,
      default: "Quiz",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      default: "",
    },
    studentEmail: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseTitle: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    answers: [studentAnswerSchema],
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TestResult || mongoose.model("TestResult", testResultSchema);
