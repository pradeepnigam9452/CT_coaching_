import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: "PDF" }, // PDF, Link, Code, Document
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  duration: { type: String, default: "15 min" },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  resources: [resourceSchema],
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Web Development",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    instructorName: {
      type: String,
      default: "Expert Instructor",
    },
    duration: {
      type: String,
      required: true,
      default: "3 Months",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    subjects: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    },
    batchStartDate: {
      type: Date,
    },
    seatsAvailable: {
      type: Number,
      default: 30,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalRatings: {
      type: Number,
      default: 24,
    },
    modules: [moduleSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
