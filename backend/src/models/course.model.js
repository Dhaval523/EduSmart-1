import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    thumbnail: {
      type: String,
      default: ""
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: ""
    },
    subcategory: {
      type: String,
      default: ""
    },
    level: {
      type: String,
      default: ""
    },
    duration: {
      type: String,
      default: ""
    },
    instructor: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    overview: {
      type: String,
      default: ""
    },
    requirements: {
      type: [String],
      default: []
    },
    learningOutcomes: {
      type: [String],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modules"
      }
    ]
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
