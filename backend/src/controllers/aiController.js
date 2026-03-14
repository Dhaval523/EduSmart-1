import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";
import { LearningPath } from "../models/LearningPath.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Normalize Gemini output into a clean array of steps.
const parseLearningSteps = (rawText) => {
  if (!rawText || typeof rawText !== "string") return [];

  const cleaned = rawText.replace(/```/g, "").trim();
  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let steps = [];

  if (lines.length > 1) {
    steps = lines.map((line) => {
      const match = line.match(/^\s*(?:\d+[\).:-]|[-*])\s*(.+)$/);
      return (match ? match[1] : line).trim();
    });
  } else {
    const inline = cleaned
      .replace(/\s*\d+[\).:-]\s*/g, "\n")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    steps = inline.length ? inline : cleaned.split(",").map((item) => item.trim());
  }

  return steps.filter(Boolean).slice(0, 12);
};

export const generateLearningPath = async (req, res) => {
  try {
    const { goal, skillLevel, preferredTopics } = req.body;

    if (!goal || !skillLevel) {
      return res.status(400).json({
        success: false,
        message: "Goal and skill level are required."
      });
    }

    const topics = Array.isArray(preferredTopics) ? preferredTopics : [];

    const prompt = `Generate a structured learning roadmap for a student.

Goal: ${goal}
Skill Level: ${skillLevel}
Preferred Topics: ${topics.join(", ")}

Return the response as a numbered list of learning steps.`;

    const result = await model.generateContent(prompt);
    const aiText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const generatedPath = parseLearningSteps(aiText);

    const newLearningPath = new LearningPath({
      userId: req.user?._id,
      goal,
      skillLevel,
      preferredTopics: topics,
      generatedPath
    });

    await newLearningPath.save();

    return res.status(200).json({
      success: true,
      learningPath: generatedPath,
      learningPathId: newLearningPath._id
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("generateLearningPath error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to generate learning path."
    });
  }
};

export const getLearningPaths = async (req, res) => {
  try {
    const userId = req.user?._id;

    const paths = await LearningPath.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      paths
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("getLearningPaths error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learning paths."
    });
  }
};
