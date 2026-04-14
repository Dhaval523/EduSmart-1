import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"
import { getAdminOrders } from "../controllers/order.controller.js"

const orderRoute = express.Router()

orderRoute.get("/", protectRoute, adminRoute, getAdminOrders)

export default orderRoute
