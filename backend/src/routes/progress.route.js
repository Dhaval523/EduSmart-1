import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCourseProgress, markModuleComplete } from "../controllers/progress.controller.js";

const progressRoute = express.Router();

progressRoute.post("/complete", protectRoute, markModuleComplete);
progressRoute.get("/course/:courseId", protectRoute, getCourseProgress);

export default progressRoute;
