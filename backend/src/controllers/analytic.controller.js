import { Course } from "../models/course.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import { Modules } from "../models/module.model.js"
import { Enrollment } from "../models/enrollment.model.js"
import { Progress } from "../models/progress.model.js"

export const getAnalyitcsData= async()=>{
    const totalUser = await User.countDocuments()
    const totalCourse = await Course.countDocuments()

    const salesData = await Order.aggregate([
        {
            $group:{
                _id:null,
                totalEntrollments:{$sum:1},
                totalRevenue:{$sum:'$totalAmount'}
            }
        }
    ])

    const {
        totalEntrollments=0,
        totalRevenue=0
    } = salesData[0]|| {}


    return {
        users:totalUser,
        courses:totalCourse,
        totalEntrollments,
        totalRevenue
    }
}


// total enrollment hain humarey pass 3
// order 1 value-> 1
// order 2 value-> 1
// order 3 value-> 1

// total enrollment = 3



export const getAnalyticsDataController=async(req,res)=>{
    try {
        const data = await getAnalyitcsData()
        return res.status(201).json(data)
    } catch (error) {
        console.log(error)
    }
}


export const dailyEnrollmentData= async(startDate, endDate)=>{
    try {

        const dailyData = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:startDate,
                        $lte:endDate
                    }
                }
            },


            {
                $group:{
                    _id:{
                        $dateToString:{format:"%Y-%m-%d", date:"$createdAt"}
                    },
                    enrollments:{$sum:1},
                    revenue:{$sum:"$totalAmount"}
                },
            },
            {$sort:{_id:1}}
        ])


        const dateArray = getDatesInRange(startDate,endDate)

        return dateArray.map((date)=>{
            const found = dailyData.find((item)=>item._id===date)
            return{
                date,
                enrollments:found?.enrollments||0,
                revenue:found?.revenue||0
            }
        })

        
        
    } catch (error) {
        console.log(error)
    }

}


function getDatesInRange(startDate, endDate){
    const dates=[]
    let currentDate = new Date(startDate)

    while(currentDate<= endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1)
    }

    return dates
}


export const getDailyAnalytcController=async(req,res)=>{
    try {
        const{startDate, endDate}= req.query

        if(!startDate || !endDate){
            return res.status(401).json({
                message:"Date not found"
            })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)


        const data = await dailyEnrollmentData(start, end)

        return res.status(201).json(data)
    } catch (error) {
        console.log(error)
    }
}

export const getAdminDashboardStats = async(req,res)=>{
    try {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - 6)
        const [
            totalCourses,
            publishedCourses,
            draftCourses,
            totalModules,
            totalEnrollments,
            totalRevenueAgg,
            recentCourses,
            recentOrders,
            categoryCounts,
            levelCounts,
            topSelling
        ] = await Promise.all([
            Course.countDocuments(),
            Course.countDocuments({ isPublished: true }),
            Course.countDocuments({ isPublished: false }),
            Modules.countDocuments(),
            Enrollment.countDocuments(),
            Order.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            Course.find().sort({ createdAt: -1 }).limit(5).lean(),
            Order.find().sort({ createdAt: -1 }).limit(5).populate("course").lean(),
            Course.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Course.aggregate([
                { $group: { _id: "$level", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Order.aggregate([
                { $group: { _id: "$course", total: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
                { $sort: { total: -1 } },
                { $limit: 5 },
                { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
                { $unwind: "$course" }
            ])
        ])

        const progressAgg = await Progress.aggregate([
            { $group: { _id: null, completed: { $sum: { $cond: ["$completed", 1, 0] } }, total: { $sum: 1 } } }
        ])
        const revenueTrend = await dailyEnrollmentData(start, end)
        const totalRevenue = totalRevenueAgg?.[0]?.totalRevenue || 0
        const completionRate = progressAgg?.[0]?.total ? Math.round((progressAgg[0].completed / progressAgg[0].total) * 100) : 0

        return res.status(200).json({
            success: true,
            kpis: {
                totalCourses,
                publishedCourses,
                draftCourses,
                totalModules,
                totalEnrollments,
                totalRevenue,
                completionRate
            },
            recentCourses,
            recentOrders,
            topSellingCourses: topSelling.map((item) => ({
                course: item.course,
                total: item.total,
                revenue: item.revenue
            })),
            categoryCounts,
            levelCounts,
            revenueTrend,
            enrollmentTrend: revenueTrend.map((d) => ({ date: d.date, enrollments: d.enrollments }))
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success:false, message:"Failed to load dashboard stats" })
    }
}
