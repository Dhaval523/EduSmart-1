import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";
import { LearningPath } from "../models/LearningPath.js";
import { ChatHistory } from "../models/chatHistory.model.js";
import {
  buildFallbackRoadmap,
  normalizeRoadmapResponse,
  parseRoadmapResponse
} from "../utils/roadmapParser.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const pickLevel = (value) => {
  const v = String(value || "").trim();
  if (v === "Beginner" || v === "Intermediate" || v === "Advanced") return v;
  return "Beginner";
};

const buildRoadmapPrompt = (input) => {
  const topics = Array.isArray(input.preferredTopics) ? input.preferredTopics.filter(Boolean) : [];
  const topicsLine = topics.length ? topics.join(", ") : "[]";

  return `Generate a structured learning roadmap in valid JSON only.
Do not return markdown.
Do not return explanation text.
Do not wrap output in code fences.
Do not include headings outside JSON.
Keep descriptions concise and frontend-friendly.
Preferred topics are optional:
- if provided, prioritize them in the roadmap
- if not provided, automatically choose the most relevant topics for the goal
Return the following top-level keys exactly:
title, goal, level, estimated_duration, learning_time_per_week, target_outcome, learning_style, prerequisites, summary, phases, resources, capstone_project, job_readiness.
Each phase must include:
id, title, duration, objective, topics, tools, projects, outcome.
Also ensure:
- phases should be ordered logically from fundamentals to advanced/application
- phases should be actionable and job-oriented
- recommended topics should match the user goal and level
- keep arrays compact and useful
- avoid repeating the same content in multiple sections

User input:
Goal / target role: ${input.goal}
Level: ${input.level}
Preferred topics (optional): ${topicsLine}
Learning time per week (optional): ${input.learningTimePerWeek || ""}
Target outcome (optional): ${input.targetOutcome || ""}
Learning style (optional): ${input.learningStyle || ""}`;
};

export const generateLearningPath = async (req, res) => {
  try {
    const {
      goal,
      skillLevel,
      preferredTopics,
      learningTimePerWeek,
      targetOutcome,
      learningStyle
    } = req.body;

    if (!goal || !skillLevel) {
      return res.status(400).json({
        success: false,
        message: "Goal and skill level are required."
      });
    }

    const input = {
      goal: String(goal).trim(),
      level: pickLevel(skillLevel),
      preferredTopics: Array.isArray(preferredTopics) ? preferredTopics : [],
      learningTimePerWeek: String(learningTimePerWeek || "").trim(),
      targetOutcome: String(targetOutcome || "").trim(),
      learningStyle: String(learningStyle || "").trim()
    };

    const prompt = buildRoadmapPrompt(input);
    const result = await model.generateContent(prompt);
    const aiText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const parsed = parseRoadmapResponse(aiText);
    const roadmap = parsed.ok
      ? normalizeRoadmapResponse(parsed.data, input)
      : buildFallbackRoadmap(input, parsed.error);

    const phasesProgress =
      Array.isArray(roadmap?.phases) && roadmap.phases.length
        ? roadmap.phases.map((p) => ({
            phaseId: p.id,
            status: "not_started",
            currentCourse: null
          }))
        : [];

    const newLearningPath = new LearningPath({
      userId: req.user?._id,
      goal: input.goal,
      skillLevel: input.level,
      preferredTopics: input.preferredTopics,
      learningTimePerWeek: input.learningTimePerWeek,
      targetOutcome: input.targetOutcome,
      learningStyle: input.learningStyle,
      // legacy field: keep a simple list for older clients
      generatedPath: roadmap?.phases?.map((p) => p?.title).filter(Boolean).slice(0, 12),
      roadmap,
      phasesProgress,
      currentPhaseId: roadmap?.phases?.[0]?.id || null
    });

    await newLearningPath.save();

    return res.status(200).json({
      success: true,
      roadmap,
      learningPathId: newLearningPath._id,
      phasesProgress: newLearningPath.phasesProgress,
      currentPhaseId: newLearningPath.currentPhaseId,
      // legacy response for older clients
      learningPath: newLearningPath.generatedPath
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

const buildChatPrompt = ({
  courseTitle,
  sectionTitle,
  lessonTitle,
  userMessage,
  timestamp
}) => {
  const safeCourse = courseTitle || "Unknown Course";
  const safeLesson = lessonTitle || "Unknown Lesson";
  const safeSection = sectionTitle || "";
  const timeLine = typeof timestamp === "number" ? `Video time: ${Math.floor(timestamp)}s` : "";

  return `You are a friendly expert tutor.
Respond in a clean structured format with short lines and spacing.
Do NOT write in one paragraph.

Format exactly like this:

Title: <short title>
Definition: <simple 1-2 line definition>
Explanation:
- <bullet 1>
- <bullet 2>
Example: <simple real-world example>
Quick Tip: <one short tip>

Rules:
- Keep total length short (3-6 lines max).
- Use simple words.
- If unclear, ask a short follow-up question.

Course: ${safeCourse}
Lesson: ${safeLesson}
${safeSection ? `Section: ${safeSection}\n` : ""}${timeLine ? `${timeLine}\n` : ""}Question: ${userMessage}`;
};

export const chatWithAI = async (req, res) => {
  try {
    const {
      message,
      courseTitle,
      sectionTitle,
      lessonTitle,
      timestamp,
      courseId,
      lessonId
    } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    const prompt = buildChatPrompt({
      courseTitle,
      sectionTitle,
      lessonTitle,
      timestamp,
      userMessage: String(message).trim()
    });

    const result = await model.generateContent(prompt);
    const aiText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const responseText =
      aiText ||
      "I couldn't generate a response right now. Please try rephrasing your question.";

    if (req.user?._id) {
      await ChatHistory.create({
        userId: req.user._id,
        courseId: courseId || null,
        lessonId: lessonId || null,
        courseTitle: courseTitle || "",
        sectionTitle: sectionTitle || "",
        lessonTitle: lessonTitle || "",
        timestamp: typeof timestamp === "number" ? timestamp : null,
        message: String(message).trim(),
        response: responseText
      });
    }

    return res.status(200).json({
      success: true,
      response: responseText
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("chatWithAI error:", safeError);
    return res.status(500).json({
      success: false,
      message: "AI response failed. Please try again."
    });
  }
};
