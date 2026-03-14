import { Course } from "../models/course.model.js";
import { Modules } from "../models/module.model.js";
import {Comment} from '../models/comment.model.js'
export const createModule = async(req,res)=>{
    try {
        const {courseId,  title, description, order, duration, isPreviewFree}= req.body;
        if(!courseId || !title){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        const videoFile = req.files?.video?.[0];
        if(!videoFile){
            return res.status(401).json({
                message:"Please provide video"
            })
        }

        const videoUrl = videoFile.path

        const rawLinks = req.body.resourceLinks;
        let linkList = []
        if (Array.isArray(rawLinks)) {
            linkList = rawLinks
        } else if (typeof rawLinks === "string" && rawLinks.trim()) {
            try {
                const parsed = JSON.parse(rawLinks)
                linkList = Array.isArray(parsed) ? parsed : [rawLinks]
            } catch {
                linkList = rawLinks.split(/\r?\n|,/g)
            }
        }

        const linkResources = linkList
            .map((link) => (typeof link === "string" ? link.trim() : ""))
            .filter(Boolean)
            .map((link) => ({
                type:"link",
                title:link,
                url:link
            }))

        const fileResources = (req.files?.resources || []).map((file)=>(
            {
            type:"file",
            title:file.originalname,
            url:file.path,
            mimeType:file.mimetype,
            fileName:file.originalname,
            publicId:file.filename
        }))

        const module = await Modules.create({
            courseId,
            title,
            description: description || "",
            order: Number.isFinite(Number(order)) ? Number(order) : 0,
            duration: duration || "",
            isPreviewFree: String(isPreviewFree) === "true" || isPreviewFree === true,
            video:videoUrl,
            resources:[...linkResources, ...fileResources]
        })
        module.save()

        await Course.findByIdAndUpdate(courseId,{
            $addToSet:{modules:module._id}
        })


        return res.status(201).json(module)
    } catch (error) {
        console.log(`error from create module, ${error}`)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const updateModule = async(req,res)=>{
    try {
        const { id } = req.params
        const { title, description, order, duration, isPreviewFree } = req.body

        const orderValue = Number(order)
        const update = {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(order !== undefined ? { order: Number.isFinite(orderValue) ? orderValue : 0 } : {}),
            ...(duration !== undefined ? { duration } : {}),
            ...(isPreviewFree !== undefined ? { isPreviewFree: String(isPreviewFree) === "true" || isPreviewFree === true } : {})
        }

        const videoFile = req.files?.video?.[0]
        if (videoFile) {
            update.video = videoFile.path
        }

        const rawLinks = req.body.resourceLinks;
        let linkList = []
        if (Array.isArray(rawLinks)) {
            linkList = rawLinks
        } else if (typeof rawLinks === "string" && rawLinks.trim()) {
            try {
                const parsed = JSON.parse(rawLinks)
                linkList = Array.isArray(parsed) ? parsed : [rawLinks]
            } catch {
                linkList = rawLinks.split(/\r?\n|,/g)
            }
        }

        const linkResources = linkList
            .map((link) => (typeof link === "string" ? link.trim() : ""))
            .filter(Boolean)
            .map((link) => ({
                type:"link",
                title:link,
                url:link
            }))

        const fileResources = (req.files?.resources || []).map((file)=>({
            type:"file",
            title:file.originalname,
            url:file.path,
            mimeType:file.mimetype,
            fileName:file.originalname,
            publicId:file.filename
        }))

        if (linkResources.length || fileResources.length) {
            update.resources = [...linkResources, ...fileResources]
        }

        const module = await Modules.findByIdAndUpdate(id, update, { new:true })
        if (!module) {
            return res.status(404).json({ message:"Module not found" })
        }

        return res.status(200).json({ success:true, module })
    } catch (error) {
        console.log(`error from update module, ${error}`)
        return res.status(500).json({ message:"Internal server error" })
    }
}

export const deleteModule = async(req,res)=>{
    try {
        const { id } = req.params
        const module = await Modules.findById(id)
        if (!module) {
            return res.status(404).json({ message:"Module not found" })
        }
        await Course.findByIdAndUpdate(module.courseId, { $pull: { modules: module._id } })
        await Modules.findByIdAndDelete(id)
        return res.status(200).json({ success:true, message:"Module deleted" })
    } catch (error) {
        console.log(`error from delete module, ${error}`)
        return res.status(500).json({ message:"Internal server error" })
    }
}


export const getSingleCourseModule = async(req,res)=>{
    try {
        const moduleId = req.params.id;
        if(!moduleId){
            return res.status(401).json({
                message:"Please provide module id"
            })
        }

        const singleModule = await Modules.findById(moduleId)

        if(!singleModule){
            return res.status(401).json({
                message:"Module not found"
            })
        }

        return res.status(201).json(singleModule)
    } catch (error) {
        console.log(error ,"from get single course module")
    }
}


export const getComment =async(req,res)=>{
    try {
        const moduleId = req.params.id;

        if(!moduleId){
            return res.status(401).json({
                message:"Please provide module Id"
            })
        }


        const moduleComment = await Modules.findById(moduleId).populate({
            path:'comments',
            populate:{
                path:'userId',
                select:'fullName email'
            },

            options:{sort:{createdAt:-1}}
        })

        return res.status(201).json(moduleComment.comments)
    } catch (error) {
        console.log(error , "from get comment")
    }
}
