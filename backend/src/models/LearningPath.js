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
    learningTimePerWeek: {
      type: String,
      default: ""
    },
    targetOutcome: {
      type: String,
      default: ""
    },
    learningStyle: {
      type: String,
      default: ""
    },
    generatedPath: {
      type: [String],
      default: []
    },
    // New structured roadmap format (preferred).
    // Stored as Mixed because the schema is enforced at the API layer via normalization.
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    phasesProgress: [
      {
        phaseId: {
          type: Number,
          required: true
        },
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed"],
          default: "not_started"
        },
        currentCourse: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          default: null
        }
      }
    ],
    currentPhaseId: {
      type: Number,
      default: null
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
