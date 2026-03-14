import { Course } from "../models/course.model.js";
import { Modules } from "../models/module.model.js";
import { Progress } from "../models/progress.model.js";

export const markModuleComplete = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, moduleId } = req.body;

        if (!courseId || !moduleId) {
            return res.status(400).json({
                success: false,
                message: "courseId and moduleId are required"
            });
        }

        const module = await Modules.findById(moduleId).select("courseId");
        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        if (module.courseId?.toString() !== courseId) {
            return res.status(400).json({
                success: false,
                message: "Module does not belong to this course"
            });
        }

        const progress = await Progress.findOneAndUpdate(
            { user: userId, module: moduleId },
            {
                user: userId,
                course: courseId,
                module: moduleId,
                completed: true,
                completedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.log(`error from markModuleComplete, ${error?.message || error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required"
            });
        }

        const course = await Course.findById(courseId).select("modules");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const completed = await Progress.find({
            user: userId,
            course: courseId,
            completed: true
        }).select("module");

        const completedModuleIds = completed.map((doc) => doc.module.toString());
        const totalModules = course.modules.length;
        const completedCount = completedModuleIds.length;
        const percent = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

        return res.status(200).json({
            success: true,
            totalModules,
            completedCount,
            completedModuleIds,
            percent
        });
    } catch (error) {
        console.log(`error from getCourseProgress, ${error?.message || error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
