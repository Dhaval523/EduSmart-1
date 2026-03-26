import ReportHeaderFilters from "@/components/reports/ReportHeaderFilters"
import ReportKpiCard from "@/components/reports/ReportKpiCard"
import { ReportCardSkeleton, ReportEmpty } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useEnrollmentsReport } from "@/hooks/report.hook"
import { defaultReportRange, exportRowsToCsv } from "@/utils/report"
import React, { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const EnrollmentsReport = () => {
  const [range, setRange] = useState(defaultReportRange())
  const { data, isLoading } = useEnrollmentsReport(range.startDate, range.endDate)

  const trendRows = data?.enrollmentsByDate || []
  const courseRows = data?.enrollmentsByCourse || []

  const tableColumns = useMemo(
    () => [
      { key: "courseName", label: "Course Name", sortable: true },
      { key: "count", label: "Enrollments", sortable: true },
    ],
    []
  )

  const exportCsv = () =>
    exportRowsToCsv("enrollments-by-course", [
      { key: "courseName", label: "Course Name" },
      { key: "count", label: "Enrollments" },
    ], courseRows)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <ReportHeaderFilters
          title="Enrollments Report"
          subtitle="Monitor enrollment trends and course-level distribution."
          startDate={range.startDate}
          endDate={range.endDate}
          onDateChange={(key, value) => setRange((prev) => ({ ...prev, [key]: value }))}
          onExport={exportCsv}
        />

        {isLoading ? (
          <ReportCardSkeleton height="h-28" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportKpiCard label="Total Enrollments" value={data?.totalEnrollments || 0} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </>
          ) : trendRows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <>
              <div className="card">
                <h2 className="text-lg font-bold text-[#1F2937]">Enrollments Over Time</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendRows}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="count" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-bold text-[#1F2937]">Enrollments by Course</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courseRows.slice(0, 10)}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="courseName" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#A29BFE" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? <ReportCardSkeleton /> : <ReportTable columns={tableColumns} rows={courseRows} emptyText="No enrollments in this range." />}
      </div>
    </div>
  )
}

export default EnrollmentsReport

