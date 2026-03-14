import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  recommendCoursesForPhase,
  markPhaseComplete,
  startPhaseCourse,
  updateRoadmapProgress
} from "../controllers/roadmap.controller.js";
import { generateLearningPath } from "../controllers/aiController.js";

const roadmapRoute = express.Router();

roadmapRoute.use(protectRoute);

roadmapRoute.post("/generate", generateLearningPath);
roadmapRoute.post("/recommend-courses", recommendCoursesForPhase);
roadmapRoute.patch("/:roadmapId/progress", updateRoadmapProgress);
roadmapRoute.patch("/:roadmapId/phases/:phaseId/complete", markPhaseComplete);
roadmapRoute.patch("/:roadmapId/phases/:phaseId/start-course", startPhaseCourse);

export default roadmapRoute;

