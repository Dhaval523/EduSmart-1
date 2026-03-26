import {
  getCoursesReportApi,
  getEngagementReportApi,
  getEnrollmentsReportApi,
  getRevenueReportApi,
  getUsersReportApi,
} from "@/Api/report.api"
import { useQuery } from "@tanstack/react-query"

const ONE_MINUTE = 60 * 1000

export const useRevenueReport = (startDate, endDate) =>
  useQuery({
    queryKey: ["report", "revenue", startDate, endDate],
    queryFn: () => getRevenueReportApi({ startDate, endDate }),
    staleTime: ONE_MINUTE,
  })

export const useUsersReport = (startDate, endDate) =>
  useQuery({
    queryKey: ["report", "users", startDate, endDate],
    queryFn: () => getUsersReportApi({ startDate, endDate }),
    staleTime: ONE_MINUTE,
  })

export const useEnrollmentsReport = (startDate, endDate) =>
  useQuery({
    queryKey: ["report", "enrollments", startDate, endDate],
    queryFn: () => getEnrollmentsReportApi({ startDate, endDate }),
    staleTime: ONE_MINUTE,
  })

export const useCoursesReport = () =>
  useQuery({
    queryKey: ["report", "courses"],
    queryFn: getCoursesReportApi,
    staleTime: ONE_MINUTE,
  })

export const useEngagementReport = (startDate, endDate) =>
  useQuery({
    queryKey: ["report", "engagement", startDate, endDate],
    queryFn: () => getEngagementReportApi({ startDate, endDate }),
    staleTime: ONE_MINUTE,
  })

