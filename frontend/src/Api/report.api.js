import axios from "axios"

const base = `${import.meta.env.VITE_BASE_URL}/reports`

const get = async (path, params) => {
  const res = await axios.get(`${base}${path}`, {
    params,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
  return res.data
}

export const getRevenueReportApi = (params) => get("/revenue", params)
export const getUsersReportApi = (params) => get("/users", params)
export const getEnrollmentsReportApi = (params) => get("/enrollments", params)
export const getCoursesReportApi = () => get("/courses")
export const getEngagementReportApi = (params) => get("/engagement", params)
