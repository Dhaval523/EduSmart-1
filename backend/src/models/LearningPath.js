import mongoose from "mongoose";

const LearningPathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    goal: {
      type: String,
      required: true,
      trim: true
    },
    skillLevel: {
      type: String,
      required: true,
      trim: true
    },
    preferredTopics: {
      type: [String],
      default: []
    },
    generatedPath: {
      type: [String],
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

export const LearningPath =
  mongoose.models.LearningPath || mongoose.model("LearningPath", LearningPathSchema);
