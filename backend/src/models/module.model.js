import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    video: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    duration: {
      type: String,
      default: "",
    },

    isPreviewFree: {
      type: Boolean,
      default: false,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null,
    },

    resources: [
      {
        type: {
          type: String,
          enum: ["link", "file"],
          required: true,
        },
        title: { type: String, trim: true },
        url: { type: String, required: true },
        mimeType: { type: String, default: "" },
        fileName: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export const Modules = mongoose.model("Modules", moduleSchema);