import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.js'
import { createCourse, deleteCourse, getAllPurchasedCourse, getCourse, getPurchasedCourse, getSingleCourse, updateCourse } from '../controllers/course.controller.js'


const courseRoute = express.Router()


courseRoute.post('/createCourse', protectRoute, adminRoute, upload.single("thumbnail"), createCourse)
courseRoute.patch('/updateCourse/:id', protectRoute, adminRoute, upload.single("thumbnail"), updateCourse)
courseRoute.delete('/deleteCourse/:id', protectRoute, adminRoute, deleteCourse)

courseRoute.get('/getCourse', protectRoute, getCourse)
courseRoute.get('/getSingleCourse/:id', protectRoute, getSingleCourse)

courseRoute.get('/purchasedCourse/:id', protectRoute, getPurchasedCourse)

courseRoute.get('/getAllCoursePurchase', protectRoute, getAllPurchasedCourse)


export default courseRoute
