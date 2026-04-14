import { Order } from "../models/order.model.js"

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "newest",
      startDate,
      endDate,
      minAmount,
      maxAmount
    } = req.query

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 1000)

    const match = {}

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

    if (minAmount || maxAmount) {
      match.totalAmount = {}
      if (minAmount !== undefined && minAmount !== "") {
        match.totalAmount.$gte = Number(minAmount)
      }
      if (maxAmount !== undefined && maxAmount !== "") {
        match.totalAmount.$lte = Number(maxAmount)
      }
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      amount_desc: { totalAmount: -1 },
      amount_asc: { totalAmount: 1 }
    }

    const searchValue = search?.trim()
    const searchRegex = searchValue ? new RegExp(escapeRegex(searchValue), "i") : null

    const basePipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          orderIdStr: { $toString: "$_id" },
          userName: "$user.fullName",
          userEmail: "$user.email",
          courseTitle: "$course.title"
        }
      }
    ]

    if (searchRegex) {
      basePipeline.push({
        $match: {
          $or: [
            { userName: { $regex: searchRegex } },
            { userEmail: { $regex: searchRegex } },
            { courseTitle: { $regex: searchRegex } },
            { orderIdStr: { $regex: searchRegex } },
            { stripeSessionId: { $regex: searchRegex } }
          ]
        }
      })
    }

    const dataPipeline = [
      ...basePipeline,
      { $sort: sortOptions[sort] || sortOptions.newest },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      {
        $project: {
          totalAmount: 1,
          stripeSessionId: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            email: "$user.email",
            profilePhoto: "$user.profilePhoto"
          },
          course: {
            _id: "$course._id",
            title: "$course.title",
            category: "$course.category",
            amount: "$course.amount"
          }
        }
      }
    ]

    const countPipeline = [...basePipeline, { $count: "total" }]

    const summaryPipeline = [
      ...basePipeline,
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]

    const [orders, countResult, summaryResult] = await Promise.all([
      Order.aggregate(dataPipeline),
      Order.aggregate(countPipeline),
      Order.aggregate(summaryPipeline)
    ])

    const total = countResult?.[0]?.total || 0
    const totalPages = Math.max(Math.ceil(total / limitNumber), 1)

    return res.status(200).json({
      success: true,
      orders,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages
      },
      summary: {
        totalOrders: summaryResult?.[0]?.totalOrders || 0,
        totalRevenue: summaryResult?.[0]?.totalRevenue || 0,
        avgOrderValue: summaryResult?.[0]?.avgOrderValue || 0
      }
    })
  } catch (error) {
    console.error("getAdminOrders error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    })
  }
}
