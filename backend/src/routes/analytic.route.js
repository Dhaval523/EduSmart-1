import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { getAdminDashboardStats, getAnalyticsDataController, getDailyAnalytcController } from '../controllers/analytic.controller.js'


const analyticRoute = express.Router()


analyticRoute.get('/getAnalytic', protectRoute, adminRoute, getAnalyticsDataController)
analyticRoute.get('/getDailyData', protectRoute, adminRoute, getDailyAnalytcController)
analyticRoute.get('/admin-dashboard', protectRoute, adminRoute, getAdminDashboardStats)


export default analyticRoute
