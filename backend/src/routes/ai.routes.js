import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { chatWithAI, generateLearningPath, getLearningPaths } from "../controllers/aiController.js";

const aiRoute = express.Router();

aiRoute.post("/ai/generate-learning-path", protectRoute, generateLearningPath);
aiRoute.get("/ai/learning-paths", protectRoute, getLearningPaths);
aiRoute.post("/ai/chat", protectRoute, chatWithAI);

export default aiRoute;
