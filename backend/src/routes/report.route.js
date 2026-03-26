import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"
import {
  getCoursesPerformanceReport,
  getEngagementReport,
  getEnrollmentsReport,
  getRevenueReport,
  getUsersReport,
} from "../controllers/report.controller.js"

const reportRoute = express.Router()

reportRoute.get("/revenue", protectRoute, adminRoute, getRevenueReport)
reportRoute.get("/users", protectRoute, adminRoute, getUsersReport)
reportRoute.get("/enrollments", protectRoute, adminRoute, getEnrollmentsReport)
reportRoute.get("/courses", protectRoute, adminRoute, getCoursesPerformanceReport)
reportRoute.get("/engagement", protectRoute, adminRoute, getEngagementReport)

export default reportRoute

