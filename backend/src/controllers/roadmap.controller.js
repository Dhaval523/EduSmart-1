import { LearningPath } from "../models/LearningPath.js";
import { Course } from "../models/course.model.js";

const toLowerSet = (items) => {
  const s = new Set();
  (items || []).forEach((v) => {
    if (!v) return;
    String(v)
      .toLowerCase()
      .split(/[\s,;/]+/)
      .filter(Boolean)
      .forEach((token) => s.add(token));
  });
  return s;
};

const scoreCourseForPhase = (course, phase, goal, level) => {
  const title = String(course.title || "").toLowerCase();
  const description = String(course.description || "").toLowerCase();
  const text = `${title} ${description} ${String(course.overview || "").toLowerCase()}`;

  const topicTokens = toLowerSet(phase.topics);
  const toolTokens = toLowerSet(phase.tools);
  const goalTokens = toLowerSet([goal]);
  const tagTokens = toLowerSet(course.tags);
  const outcomeTokens = toLowerSet(course.learningOutcomes);
  const categoryTokens = toLowerSet([course.category, course.subcategory]);

  let score = 0;

  topicTokens.forEach((t) => {
    if (t && text.includes(t)) score += 12;
  });

  toolTokens.forEach((t) => {
    if (t && text.includes(t)) score += 6;
  });

  topicTokens.forEach((t) => {
    if (t && (tagTokens.has(t) || outcomeTokens.has(t))) score += 8;
  });

  categoryTokens.forEach((t) => {
    if (t && (text.includes(t) || tagTokens.has(t))) score += 5;
  });

  goalTokens.forEach((t) => {
    if (t && text.includes(t)) score += 5;
  });

  if (level && description.includes(String(level).toLowerCase())) {
    score += 5;
  }

  if (phase.id <= 2 && /intro|beginner|fundamentals|basic/.test(text)) {
    score += 4;
  }

  if (phase.id >= 3 && /project|case study|capstone/.test(text)) {
    score += 4;
  }

  if (score === 0) {
    if (title.includes(String(goal || "").toLowerCase())) {
      score += 3;
    } else if (title.includes("data") && goal && goal.toLowerCase().includes("data")) {
      score += 3;
    }
  }

  return score;
};

const buildMatchReason = (course, phase, goal, level) => {
  const reasons = [];
  const lowerDesc = String(course.description || "").toLowerCase();
  const lowerTitle = String(course.title || "").toLowerCase();
  const tagTokens = toLowerSet(course.tags);
  const outcomeTokens = toLowerSet(course.learningOutcomes);

  const topicTokens = toLowerSet(phase.topics);
  const toolTokens = toLowerSet(phase.tools);

  const matchedTopics = [];
  topicTokens.forEach((t) => {
    if (t && (lowerDesc.includes(t) || lowerTitle.includes(t))) matchedTopics.push(t);
  });
  if (matchedTopics.length) {
    reasons.push(`Covers key topics like ${matchedTopics.slice(0, 3).join(", ")}`);
  }

  const matchedTools = [];
  toolTokens.forEach((t) => {
    if (t && (lowerDesc.includes(t) || lowerTitle.includes(t))) matchedTools.push(t);
  });
  if (matchedTools.length) {
    reasons.push(`Uses tools such as ${matchedTools.slice(0, 2).join(", ")}`);
  }

  const matchedTags = [];
  topicTokens.forEach((t) => {
    if (tagTokens.has(t)) matchedTags.push(t);
  });
  if (matchedTags.length) {
    reasons.push(`Tagged for ${matchedTags.slice(0, 3).join(", ")}`);
  }

  const matchedOutcomes = [];
  topicTokens.forEach((t) => {
    if (outcomeTokens.has(t)) matchedOutcomes.push(t);
  });
  if (matchedOutcomes.length) {
    reasons.push(`Aligned with outcomes like ${matchedOutcomes.slice(0, 2).join(", ")}`);
  }

  if (goal && (lowerDesc.includes(goal.toLowerCase()) || lowerTitle.includes(goal.toLowerCase()))) {
    reasons.push("Aligned with your overall learning goal");
  }

  if (level && lowerDesc.includes(level.toLowerCase())) {
    reasons.push(`Designed for ${level.toLowerCase()} learners`);
  }

  if (!reasons.length) {
    reasons.push("Good general fit for this phase based on title and description.");
  }

  return reasons.join(". ") + ".";
};

export const recommendCoursesForPhase = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { roadmapId, goal, level, phaseId, topics, tools } = req.body || {};

    if (!roadmapId || phaseId === undefined || phaseId === null) {
      return res.status(400).json({
        success: false,
        message: "roadmapId and phaseId are required"
      });
    }

    const learningPath = await LearningPath.findOne({ _id: roadmapId, userId }).lean();
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    const allCourses = await Course.find().lean();
    if (!allCourses.length) {
      return res.status(200).json({
        success: true,
        phaseId,
        bestMatchCourseId: null,
        recommendations: []
      });
    }

    const scoringGoal = goal || learningPath.goal;
    const scoringLevel = level || learningPath.skillLevel;
    const numericPhaseId = Number(phaseId);
    const roadmapPhases = Array.isArray(learningPath?.roadmap?.phases)
      ? learningPath.roadmap.phases
      : [];
    const roadmapPhase =
      roadmapPhases.find((p) => Number(p?.id) === numericPhaseId) ||
      roadmapPhases[numericPhaseId - 1] ||
      null;

    const phaseData = {
      id: Number.isNaN(numericPhaseId) ? 1 : numericPhaseId,
      topics: Array.isArray(topics) && topics.length ? topics : roadmapPhase?.topics || [],
      tools: Array.isArray(tools) && tools.length ? tools : roadmapPhase?.tools || []
    };

    const toSlug = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const scored = allCourses
      .map((course) => {
        const matchScore = scoreCourseForPhase(course, phaseData, scoringGoal, scoringLevel);
        return { course, matchScore };
      })
      .filter((entry) => entry.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    const fallback = !scored.length
      ? allCourses
          .slice(0, 4)
          .map((course) => ({ course, matchScore: 10 }))
      : scored;

    const ranked = (scored.length ? scored : fallback).map((entry, index) => {
      const { course, matchScore } = entry;
      return {
        id: String(course._id),
        slug: toSlug(course.title),
        title: course.title,
        description: course.description,
        level: course.level || scoringLevel || "All levels",
        duration: course.duration || "",
        topics: phaseData.topics || [],
        thumbnail: course.thumbnail || "",
        instructor: course.instructor || "",
        tags: course.tags || [],
        category: course.category || "",
        subcategory: course.subcategory || "",
        matchScore,
        matchReason: buildMatchReason(course, phaseData, scoringGoal, scoringLevel),
        isBestMatch: index === 0
      };
    });

    const bestMatch = ranked[0] || null;

    return res.status(200).json({
      success: true,
      phaseId: phaseData.id,
      bestMatchCourseId: bestMatch ? bestMatch.id : null,
      recommendations: ranked
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("recommendCoursesForPhase error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to recommend courses"
    });
  }
};

const ensurePhaseProgressEntry = (learningPath, phaseId) => {
  if (!Array.isArray(learningPath.phasesProgress)) learningPath.phasesProgress = [];
  let entry = learningPath.phasesProgress.find((p) => p.phaseId === phaseId);
  if (!entry) {
    entry = { phaseId, status: "not_started", currentCourse: null };
    learningPath.phasesProgress.push(entry);
  }
  return entry;
};

export const markPhaseComplete = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { roadmapId, phaseId } = { ...req.params, ...req.body };

    const numericPhaseId = Number(phaseId);
    if (!roadmapId || Number.isNaN(numericPhaseId)) {
      return res.status(400).json({
        success: false,
        message: "roadmapId and valid phaseId are required"
      });
    }

    const learningPath = await LearningPath.findOne({ _id: roadmapId, userId });
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    const entry = ensurePhaseProgressEntry(learningPath, numericPhaseId);
    entry.status = "completed";
    learningPath.currentPhaseId = numericPhaseId;

    await learningPath.save();

    return res.status(200).json({
      success: true,
      roadmapId,
      currentPhaseId: learningPath.currentPhaseId,
      phasesProgress: learningPath.phasesProgress
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("markPhaseComplete error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to update phase status"
    });
  }
};

export const startPhaseCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { roadmapId, phaseId } = req.params;
    const { courseId } = req.body || {};

    const numericPhaseId = Number(phaseId);
    if (!roadmapId || Number.isNaN(numericPhaseId) || !courseId) {
      return res.status(400).json({
        success: false,
        message: "roadmapId, phaseId and courseId are required"
      });
    }

    const learningPath = await LearningPath.findOne({ _id: roadmapId, userId });
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const entry = ensurePhaseProgressEntry(learningPath, numericPhaseId);
    entry.status = "in_progress";
    entry.currentCourse = course._id;
    learningPath.currentPhaseId = numericPhaseId;

    await learningPath.save();

    return res.status(200).json({
      success: true,
      roadmapId,
      currentPhaseId: learningPath.currentPhaseId,
      phasesProgress: learningPath.phasesProgress
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("startPhaseCourse error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to start course for phase"
    });
  }
};

export const updateRoadmapProgress = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { roadmapId } = req.params;
    const { currentPhaseId } = req.body || {};

    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: "roadmapId is required"
      });
    }

    const learningPath = await LearningPath.findOne({ _id: roadmapId, userId });
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found"
      });
    }

    if (currentPhaseId !== undefined && currentPhaseId !== null) {
      const numeric = Number(currentPhaseId);
      if (!Number.isNaN(numeric)) {
        learningPath.currentPhaseId = numeric;
      }
    }

    await learningPath.save();

    return res.status(200).json({
      success: true,
      roadmapId,
      currentPhaseId: learningPath.currentPhaseId,
      phasesProgress: learningPath.phasesProgress
    });
  } catch (error) {
    const safeError = error?.message || JSON.stringify(error);
    console.error("updateRoadmapProgress error:", safeError);
    return res.status(500).json({
      success: false,
      message: "Failed to update roadmap progress"
    });
  }
};

