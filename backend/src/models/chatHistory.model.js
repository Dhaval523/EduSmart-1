import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Modules",
      default: null
    },
    courseTitle: { type: String, default: "" },
    sectionTitle: { type: String, default: "" },
    lessonTitle: { type: String, default: "" },
    timestamp: { type: Number, default: null },
    message: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
