import cloudinary from "../config/cloudinary.js";
import { ENV } from "../config/env.js";
import { Course } from "../models/course.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { User } from "../models/user.model.js"; 
import {Modules} from '../models/module.model.js'
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'})

export const createCourse =async(req , res)=>{
    try {
        const {title, description, amount} = req.body;
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
            amount
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



export const getCourse = async(req, res)=>{
    try {
        
        const {search}  = req.query;

        const rawSearch = typeof search === "string" ? search.trim() : "";
        if(!rawSearch){
            const allCourses = await Course.find()

            return res.status(201).json({
                courses:allCourses
            })
        }

        const prompt =`You are an intelligent assistant for a learning management platform. A user is searching for courses. Analyze the query and return 1-3 short keywords (comma-separated, no sentences) that best match the query.

        Allowed categories / synonyms:
        - Artificial intelligence, AI, Machine Learning
        - MERN Stack, Web Development, Full Stack
        - DevOps, Cloud, Docker, Kubernetes
        - Mobile Development, Android, iOS, React Native
        - Frontend, UI, UI/UX, Design, HTML, CSS, JavaScript, React

        Rules:
        - Reply with keywords only, comma-separated.
        - Prefer category terms over long phrases.
        - If the query is in Hindi or mixed, still return English keywords.

        user query: ${rawSearch}
        `

        let aiText = ""
        try {
            const result = await model.generateContent(prompt);
            aiText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
                ?.trim()
                .replace(/[`"\n]/g, "") || "";
        } catch (err) {
            const safeError = err?.message || JSON.stringify(err)
            console.log(`ai search error: ${safeError}`)
        }

        console.log("search ", rawSearch)
        console.log("Ai text", aiText)

        const aiTerms = aiText
            ? aiText.split(",").map(t => t.trim()).filter(Boolean)
            : [];

        const termSet = new Set();
        if (rawSearch) termSet.add(rawSearch);
        aiTerms.forEach(t => termSet.add(t));

        const terms = Array.from(termSet).slice(0, 6);

        const mongoQuery = {
            $or: terms.flatMap(term => ([
                { title: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } }
            ]))
        }

        let courses = await Course.find(mongoQuery).lean()

        console.log(`found ,${courses.length} , courses ${rawSearch}`)


        return res.status(201).json({
            success:true,
            courses,
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

        const course = await Course.findById(courseId).populate("modules")


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

        const purchasedOrder = await Course.findById(courseId).populate("modules")


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
