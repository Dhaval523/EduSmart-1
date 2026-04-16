import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ENV } from "../config/env.js";
import cloudinary from "../config/cloudinary.js";

const getTokenCookieOptions = (req) => {
    const isProd = ENV.NODE_ENV === "production"
    const isSecure = isProd || req.secure || req.headers["x-forwarded-proto"] === "https"

    return {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax"
    }
}


export const Register = async(req ,res)=>{
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password){
            return res.status(401).json({
                message:"Please provide all the details", 
                success:false
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"User already exist"
            })
        }

        // virendra
        // hash password :- asflkhagf@#$%@#^%aFGA35,
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword
        })

        const token = await jwt.sign({userId:newUser._id},ENV.JWT_SECRET )

        if(newUser.email === ENV.ADMIN){
            return res.status(201).cookie("token", token, getTokenCookieOptions(req)).json({
                message:`welcome back admin ${newUser.fullName}`,
                
            })
        }

        return res.status(201).cookie("token", token, getTokenCookieOptions(req)).json({
                message:`welcome back  ${newUser.fullName}`
            })


    } catch (error) {
        console.log(`error from register backend, ${error}`)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const Login = async(req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                messsage:"Please provide all the details"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"Erorr in email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
             return res.status(401).json({
                message:"Erorr in email or password"
            })
        }



        // if(user.email == ENV.ADMIN){
        //     user.admin = true,
        //     await user.save()
        // }

        const token = await jwt.sign({userId:user._id},ENV.JWT_SECRET )

        console.log("admin")


        res.cookie("token",token,{
            ...getTokenCookieOptions(req)
        })

        if(user.admin){
            return res.status(201).json({
                message:"Welcome back admin"
            })
        }


        return res.status(201).json({
            message:`Welcome ${user.fullName}`
        })

        
    } catch (error) {
        console.log(`error from Login backend, ${error}`)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const getUser = async(req,res)=>{
    try {
        const userId = req.user._id

        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }


        return res.status(201).json(user)
    } catch (error) {
        console.log(`error from get User, ${error}`)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const logout=async(req,res)=>{
    try {
        return res.cookie("token","", { ...getTokenCookieOptions(req), maxAge: 0 }).status(201).json({
            message:"User logged out"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName } = req.body;
        
        const updateData = {};
        
        if (fullName) {
            updateData.fullName = fullName;
        }
        
        // Safe file check
        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            
            const uploadRes = await cloudinary.uploader.upload(base64, {
                folder: "profilePhoto",
            });
            
            updateData.profilePhoto = uploadRes.secure_url;
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
        
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const getAdminUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            role = "all",
            sort = "newest",
            startDate,
            endDate
        } = req.query

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
        const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 1000)

        const match = {}

        if (role === "admin") {
            match.admin = true
        } else if (role === "student") {
            match.admin = false
        }

        if (startDate || endDate) {
            match.createdAt = {}
            if (startDate) {
                match.createdAt.$gte = new Date(startDate)
            }
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                match.createdAt.$lte = end
            }
        }

        const searchValue = search?.trim()
        const searchRegex = searchValue ? new RegExp(escapeRegex(searchValue), "i") : null

        const basePipeline = [{ $match: match }]

        if (searchRegex) {
            basePipeline.push({
                $match: {
                    $or: [
                        { fullName: { $regex: searchRegex } },
                        { email: { $regex: searchRegex } }
                    ]
                }
            })
        }

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            name_asc: { fullName: 1 },
            name_desc: { fullName: -1 },
            orders_desc: { orderCount: -1 },
            spent_desc: { totalSpent: -1 }
        }

        const dataPipeline = [
            ...basePipeline,
            {
                $lookup: {
                    from: "orders",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
                        {
                            $group: {
                                _id: null,
                                orderCount: { $sum: 1 },
                                totalSpent: { $sum: "$totalAmount" }
                            }
                        }
                    ],
                    as: "orderStats"
                }
            },
            {
                $addFields: {
                    orderCount: { $ifNull: [{ $arrayElemAt: ["$orderStats.orderCount", 0] }, 0] },
                    totalSpent: { $ifNull: [{ $arrayElemAt: ["$orderStats.totalSpent", 0] }, 0] },
                    purchasedCount: { $size: { $ifNull: ["$purchasedCourse", []] } }
                }
            },
            { $sort: sortOptions[sort] || sortOptions.newest },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber },
            {
                $project: {
                    fullName: 1,
                    email: 1,
                    admin: 1,
                    createdAt: 1,
                    profilePhoto: 1,
                    orderCount: 1,
                    totalSpent: 1,
                    purchasedCount: 1
                }
            }
        ]

        const countFilter = { ...match }
        if (searchRegex) {
            countFilter.$or = [
                { fullName: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ]
        }

        const [
            users,
            total,
            totalUsers,
            adminUsers,
            orderSummary
        ] = await Promise.all([
            User.aggregate(dataPipeline),
            User.countDocuments(countFilter),
            User.countDocuments(),
            User.countDocuments({ admin: true }),
            Order.aggregate([
                { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$totalAmount" } } }
            ])
        ])

        const totalPages = Math.max(Math.ceil(total / limitNumber), 1)
        const totalOrders = orderSummary?.[0]?.totalOrders || 0
        const totalRevenue = orderSummary?.[0]?.totalRevenue || 0

        return res.status(200).json({
            success: true,
            users,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages
            },
            summary: {
                totalUsers,
                adminUsers,
                studentUsers: Math.max(totalUsers - adminUsers, 0),
                totalOrders,
                totalRevenue
            }
        })
    } catch (error) {
        console.error("getAdminUsers error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        })
    }
}
