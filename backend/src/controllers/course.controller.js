import cloudinary from "../config/cloudinary.js";
import { ENV } from "../config/env.js";
import { Course } from "../models/course.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { User } from "../models/user.model.js"; 
import {Modules} from '../models/module.model.js'
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'})

const parseList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    return String(value)
        .split(/\r?\n|,/g)
        .map((v) => v.trim())
        .filter(Boolean)
}

export const createCourse =async(req , res)=>{
    try {
        const {
            title,
            description,
            amount,
            category,
            subcategory,
            level,
            duration,
            instructor,
            tags,
            overview,
            requirements,
            learningOutcomes,
            isPublished
        } = req.body;
        const thumbnail = req.file

        if(!title || !description || !amount){
            return res.status(401).json({
                message:"Please provide all the detail"
            })
        }

        if(!thumbnail){
            return res.status(400).json({
                message:"Thumbnail file is required"
            })
        }

        let imageUrl =""
        
        const base64 = `data:${thumbnail.mimetype};base64,${thumbnail.buffer.toString("base64")}`;

        const uploadRes = await cloudinary.uploader.upload(base64,{
            folder:"lmsYT"
        })

        imageUrl = uploadRes.secure_url

        const newCourse = new Course({
            userId:req.user._id,
            title,
            description,
            thumbnail:imageUrl,
            amount,
            category: category || "",
            subcategory: subcategory || "",
            level: level || "",
            duration: duration || "",
            instructor: instructor || "",
            tags: parseList(tags),
            overview: overview || "",
            requirements: parseList(requirements),
            learningOutcomes: parseList(learningOutcomes),
            isPublished: String(isPublished) === "true" || isPublished === true
        })

        await newCourse.save()

        return res.status(201).json({
            message:"Course Created Successfully",
            newCourse
        })

    } catch (error) {
        const safeError = error?.message || JSON.stringify(error)
        console.log(`error from create course. ${safeError}`)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const updateCourse = async(req, res)=>{
    try {
        const { id } = req.params
        const {
            title,
            description,
            amount,
            category,
            subcategory,
            level,
            duration,
            instructor,
            tags,
            overview,
            requirements,
            learningOutcomes,
            isPublished
        } = req.body;

        const update = {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(amount !== undefined ? { amount } : {}),
            ...(category !== undefined ? { category } : {}),
            ...(subcategory !== undefined ? { subcategory } : {}),
            ...(level !== undefined ? { level } : {}),
            ...(duration !== undefined ? { duration } : {}),
            ...(instructor !== undefined ? { instructor } : {}),
            ...(tags !== undefined ? { tags: parseList(tags) } : {}),
            ...(overview !== undefined ? { overview } : {}),
            ...(requirements !== undefined ? { requirements: parseList(requirements) } : {}),
            ...(learningOutcomes !== undefined ? { learningOutcomes: parseList(learningOutcomes) } : {}),
            ...(isPublished !== undefined ? { isPublished: String(isPublished) === "true" || isPublished === true } : {})
        }

        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadRes = await cloudinary.uploader.upload(base64,{
                folder:"lmsYT"
            })
            update.thumbnail = uploadRes.secure_url
        }

        if (update.isPublished === true) {
            const existing = await Course.findById(id).lean()
            if (!existing) {
                return res.status(404).json({ message:"Course not found" })
            }
            const moduleCount = existing.modules?.length || 0
            if (moduleCount < 1) {
                return res.status(400).json({ message:"Add at least 1 module before publishing this course." })
            }
        }

        const course = await Course.findByIdAndUpdate(id, update, { new:true })
        if(!course){
            return res.status(404).json({ message:"Course not found" })
        }
        return res.status(200).json({ success:true, course })
    } catch (error) {
        const safeError = error?.message || JSON.stringify(error)
        console.log(`error from update course. ${safeError}`)
        return res.status(500).json({ success:false, message:"Internal server error" })
    }
}

export const deleteCourse = async(req,res)=>{
    try {
        const { id } = req.params
        const course = await Course.findById(id)
        if(!course){
            return res.status(404).json({ message:"Course not found" })
        }
        await Modules.deleteMany({ courseId: id })
        await Course.findByIdAndDelete(id)
        return res.status(200).json({ success:true, message:"Course deleted" })
    } catch (error) {
        const safeError = error?.message || JSON.stringify(error)
        console.log(`error from delete course. ${safeError}`)
        return res.status(500).json({ success:false, message:"Internal server error" })
    }
}

export const getCourse = async(req, res)=>{
    try {
        const {search, category, subcategory, level, tag, page = 1, limit = 10, sort = 'updated_desc', instructor, published, hasThumbnail, hasModules}  = req.query;

        const rawSearch = typeof search === "string" ? search.trim() : "";
        const filters = {}
        if (category) filters.category = new RegExp(String(category), "i")
        if (subcategory) filters.subcategory = new RegExp(String(subcategory), "i")
        if (level) filters.level = new RegExp(String(level), "i")
        if (instructor) filters.instructor = new RegExp(String(instructor), "i")
        if (published !== undefined && published !== "") filters.isPublished = String(published) === "true"
        if (tag) filters.tags = { $in: [String(tag)] }
        if (hasThumbnail === "true") filters.thumbnail = { $ne: "" }
        if (hasThumbnail === "false") filters.$or = [{ thumbnail: "" }, { thumbnail: { $exists:false } }]
        if (hasModules === "true") filters.modules = { $exists:true, $not: { $size: 0 } }
        if (hasModules === "false") filters.modules = { $size: 0 }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            title_asc: { title: 1 },
            title_desc: { title: -1 },
            price_asc: { amount: 1 },
            price_desc: { amount: -1 },
            modules_desc: { modules: -1 },
            updated_desc: { updatedAt: -1 }
        }
        const sortValue = sortMap[sort] || sortMap.updated_desc

        const mongoQuery = rawSearch
            ? {
                $and: [
                    filters,
                    {
                        $or: [
                            { title: { $regex: rawSearch, $options: "i" } },
                            { description: { $regex: rawSearch, $options: "i" } },
                            { overview: { $regex: rawSearch, $options: "i" } },
                            { instructor: { $regex: rawSearch, $options: "i" } },
                            { category: { $regex: rawSearch, $options: "i" } },
                            { tags: { $in: [rawSearch] } }
                        ]
                    }
                ]
            }
            : filters

        const pageNum = Math.max(parseInt(page, 10) || 1, 1)
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50)
        const skip = (pageNum - 1) * limitNum

        const [totalCount, courses] = await Promise.all([
            Course.countDocuments(mongoQuery),
            Course.find(mongoQuery)
                .sort(sortValue)
                .skip(skip)
                .limit(limitNum)
                .lean()
        ])

        return res.status(201).json({
            success:true,
            courses,
            meta:{
                total: totalCount,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalCount / limitNum)
            },
            count:courses.length,
            searchTerm:rawSearch,

        })

    } catch (error) {
        const safeError = error?.message || JSON.stringify(error)
        console.log(`error from getCourse, ${safeError}`)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}



export const getSingleCourse=async(req,res)=>{
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate({
            path:"modules",
            options:{ sort:{ order:1 }},
            select:"title description duration order isPreviewFree resources video quiz"
        })


        if(!course){
            return res.status(401).json({
                message:"Course not found"
            })
        }


        return res.status(201).json(course)
    } catch (error) {
        console.log(error ," from get single course")
    }
}


// user ne 4 course purchase kiye 
// lekin ab user jo hai woh kisi ek course se padhna chahta hai 
// toh user kisi ek course koi padhen k liye selecte karega toh uske liye humne getpurchase course ka controller create kiye hai yeh apko ek single course provide karega from purchased course

export const getPurchasedCourse = async(req,res)=>{
    try {
        const courseId = req.params.id;

        if(!courseId){
            return res.status(401).json({
                message:"course not found"
            })
        }

        const purchasedOrder = await Course.findById(courseId).populate({
            path:"modules",
            options:{ sort:{ order:1 }},
            select:"title description duration order isPreviewFree resources video quiz"
        })


        if(!purchasedOrder){
            return res.status(401).json({
                message:"Course not found"
            })
        }


        return res.status(201).json(purchasedOrder)
    } catch (error) {
        console.log(error, "from getPurchased course")
    }
}


export const getAllPurchasedCourse = async(req,res)=>{
    try {
        const userId = req.user._id

        const user = await User.findById(userId).populate("purchasedCourse")

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
}
