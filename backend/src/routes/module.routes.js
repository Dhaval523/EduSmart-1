import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createModule, deleteModule, getComment, getSingleCourseModule, updateModule } from "../controllers/module.controller.js";
import { videoUpload } from "../middleware/videoUpload.js";

const moduleRoute = express.Router()


moduleRoute.post(
    '/createModule',
    protectRoute,
    adminRoute,
    videoUpload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'resources', maxCount: 10 }
    ]),
    createModule
)
moduleRoute.get('/getModule/:id', protectRoute, getSingleCourseModule)
moduleRoute.patch('/updateModule/:id', protectRoute, adminRoute, videoUpload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'resources', maxCount: 10 }
]), updateModule)
moduleRoute.delete('/deleteModule/:id', protectRoute, adminRoute, deleteModule)
moduleRoute.get('/comment/:id', protectRoute, getComment)

export default moduleRoute
