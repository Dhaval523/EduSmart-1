import ReportKpiCard from "@/components/reports/ReportKpiCard"
import { ReportCardSkeleton, ReportEmpty } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useCoursesReport, useEngagementReport, useEnrollmentsReport, useRevenueReport, useUsersReport } from "@/hooks/report.hook"
import { defaultReportRange, exportRowsToCsv, formatINR } from "@/utils/report"
import React, { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const TABS = [
  { key: "revenue", label: "Revenue" },
  { key: "users", label: "Users" },
  { key: "enrollments", label: "Enrollments" },
  { key: "courses", label: "Courses" },
  { key: "engagement", label: "Engagement" },
]

const TabFilters = ({ startDate, endDate, setRange, onExport, hideDateFilter = false }) => (
  <div className="card flex flex-col md:flex-row md:items-end md:justify-between gap-3">
    {hideDateFilter ? <div /> : (
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.12em]">
          Start Date
          <input type="date" value={startDate} onChange={(e) => setRange((prev) => ({ ...prev, startDate: e.target.value }))} className="mt-1 block w-full sm:w-44 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.12em]">
          End Date
          <input type="date" value={endDate} onChange={(e) => setRange((prev) => ({ ...prev, endDate: e.target.value }))} className="mt-1 block w-full sm:w-44 px-3 py-2 text-sm" />
        </label>
      </div>
    )}
    <button onClick={onExport} className="btn-secondary w-fit">Export CSV</button>
  </div>
)

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab") || "revenue"
  const activeTab = TABS.some((tab) => tab.key === rawTab) ? rawTab : "revenue"

  const [revenueRange, setRevenueRange] = useState(defaultReportRange())
  const [usersRange, setUsersRange] = useState(defaultReportRange())
  const [enrollmentRange, setEnrollmentRange] = useState(defaultReportRange())
  const [engagementRange, setEngagementRange] = useState(defaultReportRange())

  const revenue = useRevenueReport(revenueRange.startDate, revenueRange.endDate)
  const users = useUsersReport(usersRange.startDate, usersRange.endDate)
  const enrollments = useEnrollmentsReport(enrollmentRange.startDate, enrollmentRange.endDate)
  const courses = useCoursesReport()
  const engagement = useEngagementReport(engagementRange.startDate, engagementRange.endDate)

  const revenueColumns = useMemo(() => [
    { key: "courseName", label: "Course Name", sortable: true },
    { key: "revenue", label: "Revenue", sortable: true, render: (value) => formatINR(value) },
  ], [])

  const usersColumns = useMemo(() => [
    { key: "date", label: "Date", sortable: true },
    { key: "count", label: "New Users", sortable: true },
  ], [])

  const enrollmentsColumns = useMemo(() => [
    { key: "courseName", label: "Course Name", sortable: true },
    { key: "count", label: "Enrollments", sortable: true },
  ], [])

  const coursesColumns = useMemo(() => [
    { key: "courseName", label: "Course Name", sortable: true },
    { key: "totalEnrollments", label: "Enrollments", sortable: true },
    { key: "completionRate", label: "Completion Rate (%)", sortable: true },
    { key: "averageProgress", label: "Avg Progress (%)", sortable: true },
  ], [])

  const renderTabContent = () => {
    if (activeTab === "revenue") {
      const rows = revenue.data?.revenueByCourse || []
      const trend = revenue.data?.revenueByDate || []
      return (
        <div className="space-y-6">
          <TabFilters startDate={revenueRange.startDate} endDate={revenueRange.endDate} setRange={setRevenueRange} onExport={() => exportRowsToCsv("revenue-by-course", [{ key: "courseName", label: "Course Name" }, { key: "revenue", label: "Revenue" }], rows)} />
          {revenue.isLoading ? <ReportCardSkeleton height="h-28" /> : <ReportKpiCard label="Total Revenue" value={formatINR(revenue.data?.totalRevenue || 0)} />}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {revenue.isLoading ? <><ReportCardSkeleton /><ReportCardSkeleton /></> : trend.length === 0 ? <ReportEmpty /> : <>
              <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Revenue Over Time</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(value) => [formatINR(value), "Revenue"]} /><Line dataKey="amount" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></div>
              <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Revenue by Course</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows.slice(0, 10)}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="courseName" hide /><YAxis /><Tooltip formatter={(value) => [formatINR(value), "Revenue"]} /><Bar dataKey="revenue" fill="#A29BFE" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
            </>}
          </div>
          {revenue.isLoading ? <ReportCardSkeleton /> : <ReportTable columns={revenueColumns} rows={rows} emptyText="No revenue by course in this range." />}
        </div>
      )
    }

    if (activeTab === "users") {
      const rows = users.data?.newUsersByDate || []
      return (
        <div className="space-y-6">
          <TabFilters startDate={usersRange.startDate} endDate={usersRange.endDate} setRange={setUsersRange} onExport={() => exportRowsToCsv("new-users-by-date", [{ key: "date", label: "Date" }, { key: "count", label: "New Users" }], rows)} />
          {users.isLoading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><ReportCardSkeleton height="h-28" /><ReportCardSkeleton height="h-28" /><ReportCardSkeleton height="h-28" /></div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><ReportKpiCard label="Total Users" value={users.data?.totalUsers || 0} /><ReportKpiCard label="Active Users (7 Days)" value={users.data?.activeUsers?.last7Days || 0} /><ReportKpiCard label="Active Users (30 Days)" value={users.data?.activeUsers?.last30Days || 0} /></div>}
          {users.isLoading ? <ReportCardSkeleton /> : <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">New Users Growth</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="count" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></div>}
          {users.isLoading ? <ReportCardSkeleton /> : <ReportTable columns={usersColumns} rows={rows} emptyText="No new users in this range." />}
        </div>
      )
    }

    if (activeTab === "enrollments") {
      const trendRows = enrollments.data?.enrollmentsByDate || []
      const courseRows = enrollments.data?.enrollmentsByCourse || []
      return (
        <div className="space-y-6">
          <TabFilters startDate={enrollmentRange.startDate} endDate={enrollmentRange.endDate} setRange={setEnrollmentRange} onExport={() => exportRowsToCsv("enrollments-by-course", [{ key: "courseName", label: "Course Name" }, { key: "count", label: "Enrollments" }], courseRows)} />
          {enrollments.isLoading ? <ReportCardSkeleton height="h-28" /> : <ReportKpiCard label="Total Enrollments" value={enrollments.data?.totalEnrollments || 0} />}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {enrollments.isLoading ? <><ReportCardSkeleton /><ReportCardSkeleton /></> : trendRows.length === 0 ? <ReportEmpty /> : <>
              <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Enrollments Over Time</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendRows}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="count" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></div>
              <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Enrollments by Course</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={courseRows.slice(0, 10)}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="courseName" hide /><YAxis /><Tooltip /><Bar dataKey="count" fill="#A29BFE" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
            </>}
          </div>
          {enrollments.isLoading ? <ReportCardSkeleton /> : <ReportTable columns={enrollmentsColumns} rows={courseRows} emptyText="No enrollments in this range." />}
        </div>
      )
    }

    if (activeTab === "courses") {
      const rows = courses.data?.courses || []
      return (
        <div className="space-y-6">
          <TabFilters hideDateFilter onExport={() => exportRowsToCsv("course-performance", [{ key: "courseName", label: "Course Name" }, { key: "totalEnrollments", label: "Enrollments" }, { key: "completionRate", label: "Completion Rate (%)" }, { key: "averageProgress", label: "Avg Progress (%)" }], rows)} />
          {courses.isLoading ? <ReportCardSkeleton /> : <ReportTable columns={coursesColumns} rows={rows} emptyText="No course performance data available." />}
        </div>
      )
    }

    const dauRows = engagement.data?.dailyActiveUsers || []
    const lessonRows = engagement.data?.lessonsCompleted || []
    const tableRows = dauRows.map((item, index) => ({ date: item.date, dailyActiveUsers: item.count || 0, lessonsCompleted: lessonRows[index]?.count || 0 }))
    return (
      <div className="space-y-6">
        <TabFilters startDate={engagementRange.startDate} endDate={engagementRange.endDate} setRange={setEngagementRange} onExport={() => exportRowsToCsv("engagement-daily", [{ key: "date", label: "Date" }, { key: "dailyActiveUsers", label: "Daily Active Users" }, { key: "lessonsCompleted", label: "Lessons Completed" }], tableRows)} />
        {engagement.isLoading ? <ReportCardSkeleton height="h-28" /> : <ReportKpiCard label="Avg Session Time (mins)" value={engagement.data?.avgSessionTime || 0} />}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {engagement.isLoading ? <><ReportCardSkeleton /><ReportCardSkeleton /></> : <>
            <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Daily Active Users</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={dauRows}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="count" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></div>
            <div className="card"><h2 className="text-lg font-bold text-[#1F2937]">Lessons Completed</h2><div className="h-80 mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={lessonRows}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#A29BFE" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          </>}
        </div>
        {engagement.isLoading ? <ReportCardSkeleton /> : <ReportTable columns={[{ key: "date", label: "Date", sortable: true }, { key: "dailyActiveUsers", label: "Daily Active Users", sortable: true }, { key: "lessonsCompleted", label: "Lessons Completed", sortable: true }]} rows={tableRows} emptyText="No engagement data in this range." />}
      </div>
    )
  }

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <div className="card">
          <h1 className="text-3xl font-black text-[#1F2937]">Reports</h1>
          <p className="text-sm text-[#6B7280] mt-1">Switch between report categories without leaving this page.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSearchParams({ tab: tab.key })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab.key ? "bg-[#6C5DD3] text-white" : "bg-[#F7F7FB] text-[#1F2937] hover:bg-[#EDEBFF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Reports

