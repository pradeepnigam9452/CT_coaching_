import mongoose from "mongoose";

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

    duration: {
      type: String, // e.g. "6 Months", "1 Year"
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },

    subjects: [
      {
        type: String,
      },
    ],

    batchStartDate: {
      type: Date,
    },

    seatsAvailable: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
