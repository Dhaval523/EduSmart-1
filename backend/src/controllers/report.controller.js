import { Course } from "../models/course.model.js"
import { Enrollment } from "../models/enrollment.model.js"
import { Order } from "../models/order.model.js"
import { Progress } from "../models/progress.model.js"
import { User } from "../models/user.model.js"

const DAY_MS = 24 * 60 * 60 * 1000

const toUtcStartOfDay = (input) => {
  const date = new Date(input)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
}

const toUtcEndOfDay = (input) => {
  const date = new Date(input)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
}

const parseDateRange = (query = {}) => {
  const hasStart = Boolean(query.startDate)
  const hasEnd = Boolean(query.endDate)

  if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
    return { error: "Both startDate and endDate are required together" }
  }

  let startDate
  let endDate

  if (hasStart && hasEnd) {
    startDate = toUtcStartOfDay(query.startDate)
    endDate = toUtcEndOfDay(query.endDate)
  } else {
    endDate = toUtcEndOfDay(new Date())
    startDate = new Date(endDate.getTime() - 29 * DAY_MS)
    startDate = toUtcStartOfDay(startDate)
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { error: "Invalid date format. Use YYYY-MM-DD" }
  }

  if (startDate > endDate) {
    return { error: "startDate must be before or equal to endDate" }
  }

  return { startDate, endDate }
}

const dateLabelsBetween = (startDate, endDate) => {
  const labels = []
  let current = new Date(startDate)

  while (current <= endDate) {
    labels.push(current.toISOString().split("T")[0])
    current = new Date(current.getTime() + DAY_MS)
  }

  return labels
}

const withFilledDates = (startDate, endDate, rows, key) => {
  const labels = dateLabelsBetween(startDate, endDate)
  const rowMap = new Map(rows.map((item) => [item.date, item[key]]))
  return labels.map((date) => ({ date, [key]: rowMap.get(date) || 0 }))
}

export const getRevenueReport = async (req, res) => {
  try {
    const parsed = parseDateRange(req.query)
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error })
    }

    const { startDate, endDate } = parsed

    const [totalsAgg, revenueByDateAgg, revenueByCourseAgg] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            amount: { $sum: "$totalAmount" },
          },
        },
        { $project: { _id: 0, date: "$_id", amount: 1 } },
        { $sort: { date: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$course", revenue: { $sum: "$totalAmount" } } },
        { $sort: { revenue: -1 } },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            courseId: "$_id",
            courseName: { $ifNull: ["$course.title", "Unknown Course"] },
            revenue: 1,
          },
        },
      ]),
    ])

    return res.status(200).json({
      success: true,
      totalRevenue: totalsAgg?.[0]?.totalRevenue || 0,
      revenueByDate: withFilledDates(startDate, endDate, revenueByDateAgg, "amount"),
      revenueByCourse: revenueByCourseAgg,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to load revenue report" })
  }
}

export const getUsersReport = async (req, res) => {
  try {
    const parsed = parseDateRange(req.query)
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error })
    }

    const { startDate, endDate } = parsed
    const now = new Date()
    const last7 = new Date(now.getTime() - 6 * DAY_MS)
    const last30 = new Date(now.getTime() - 29 * DAY_MS)

    const [totalUsers, newUsersByDateAgg, active7, active30] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),
      Progress.distinct("user", { updatedAt: { $gte: last7, $lte: now } }),
      Progress.distinct("user", { updatedAt: { $gte: last30, $lte: now } }),
    ])

    return res.status(200).json({
      success: true,
      totalUsers,
      newUsersByDate: withFilledDates(startDate, endDate, newUsersByDateAgg, "count"),
      activeUsers: {
        last7Days: active7.length,
        last30Days: active30.length,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to load users report" })
  }
}

export const getEnrollmentsReport = async (req, res) => {
  try {
    const parsed = parseDateRange(req.query)
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error })
    }

    const { startDate, endDate } = parsed
    const courseIdExpr = {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$courseId" }, "string"] },
            { $regexMatch: { input: "$courseId", regex: /^[a-fA-F0-9]{24}$/ } },
          ],
        },
        { $toObjectId: "$courseId" },
        "$courseId",
      ],
    }

    const [totalEnrollments, enrollmentsByDateAgg, enrollmentsByCourseAgg] = await Promise.all([
      Enrollment.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Enrollment.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),
      Enrollment.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $addFields: { normalizedCourseId: courseIdExpr } },
        { $group: { _id: "$normalizedCourseId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            courseId: "$_id",
            courseName: { $ifNull: ["$course.title", "Unknown Course"] },
            count: 1,
          },
        },
      ]),
    ])

    return res.status(200).json({
      success: true,
      totalEnrollments,
      enrollmentsByDate: withFilledDates(startDate, endDate, enrollmentsByDateAgg, "count"),
      enrollmentsByCourse: enrollmentsByCourseAgg,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to load enrollments report" })
  }
}

export const getCoursesPerformanceReport = async (req, res) => {
  try {
    const enrollmentCourseIdExpr = {
      $cond: [
        {
          $and: [
            { $eq: [{ $type: "$courseId" }, "string"] },
            { $regexMatch: { input: "$courseId", regex: /^[a-fA-F0-9]{24}$/ } },
          ],
        },
        { $toObjectId: "$courseId" },
        "$courseId",
      ],
    }

    const data = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          let: { courseId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: [enrollmentCourseIdExpr, "$$courseId"] } } }],
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "progresses",
          localField: "_id",
          foreignField: "course",
          as: "progresses",
        },
      },
      {
        $addFields: {
          totalEnrollments: { $size: "$enrollments" },
          totalProgressRecords: { $size: "$progresses" },
          completedProgressRecords: {
            $size: {
              $filter: {
                input: "$progresses",
                as: "progress",
                cond: { $eq: ["$$progress.completed", true] },
              },
            },
          },
          totalModules: { $size: { $ifNull: ["$modules", []] } },
        },
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ["$totalProgressRecords", 0] },
              {
                $multiply: [
                  { $divide: ["$completedProgressRecords", "$totalProgressRecords"] },
                  100,
                ],
              },
              0,
            ],
          },
          averageProgress: {
            $cond: [
              { $and: [{ $gt: ["$totalEnrollments", 0] }, { $gt: ["$totalModules", 0] }] },
              {
                $min: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$completedProgressRecords",
                          { $multiply: ["$totalEnrollments", "$totalModules"] },
                        ],
                      },
                      100,
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          courseName: "$title",
          totalEnrollments: 1,
          completionRate: { $round: ["$completionRate", 2] },
          averageProgress: { $round: ["$averageProgress", 2] },
        },
      },
      { $sort: { totalEnrollments: -1, courseName: 1 } },
    ])

    return res.status(200).json({
      success: true,
      courses: data,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to load courses report" })
  }
}

export const getEngagementReport = async (req, res) => {
  try {
    const parsed = parseDateRange(req.query)
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error })
    }

    const { startDate, endDate } = parsed

    const [dailyActiveUsersAgg, lessonsCompletedAgg, avgSessionAgg] = await Promise.all([
      Progress.aggregate([
        { $match: { updatedAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
              user: "$user",
            },
          },
        },
        { $group: { _id: "$_id.date", count: { $sum: 1 } } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),
      Progress.aggregate([
        {
          $match: {
            completed: true,
            completedAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),
      Progress.aggregate([
        {
          $match: {
            completed: true,
            completedAt: { $gte: startDate, $lte: endDate },
            createdAt: { $exists: true },
          },
        },
        {
          $project: {
            durationMinutes: {
              $divide: [{ $subtract: ["$completedAt", "$createdAt"] }, 1000 * 60],
            },
          },
        },
        { $match: { durationMinutes: { $gte: 0, $lte: 240 } } },
        { $group: { _id: null, avgSessionTime: { $avg: "$durationMinutes" } } },
      ]),
    ])

    return res.status(200).json({
      success: true,
      dailyActiveUsers: withFilledDates(startDate, endDate, dailyActiveUsersAgg, "count"),
      lessonsCompleted: withFilledDates(startDate, endDate, lessonsCompletedAgg, "count"),
      avgSessionTime: Number((avgSessionAgg?.[0]?.avgSessionTime || 0).toFixed(2)),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to load engagement report" })
  }
}
