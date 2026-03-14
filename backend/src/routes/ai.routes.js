import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generateLearningPath, getLearningPaths } from "../controllers/aiController.js";

const aiRoute = express.Router();

aiRoute.post("/ai/generate-learning-path", protectRoute, generateLearningPath);
aiRoute.get("/ai/learning-paths", protectRoute, getLearningPaths);

export default aiRoute;
