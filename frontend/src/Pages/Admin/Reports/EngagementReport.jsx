import ReportHeaderFilters from "@/components/reports/ReportHeaderFilters"
import ReportKpiCard from "@/components/reports/ReportKpiCard"
import { ReportCardSkeleton } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useEngagementReport } from "@/hooks/report.hook"
import { defaultReportRange, exportRowsToCsv } from "@/utils/report"
import React, { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const EngagementReport = () => {
  const [range, setRange] = useState(defaultReportRange())
  const { data, isLoading } = useEngagementReport(range.startDate, range.endDate)

  const dauRows = data?.dailyActiveUsers || []
  const lessonRows = data?.lessonsCompleted || []
  const tableRows = dauRows.map((item, index) => ({
    date: item.date,
    dailyActiveUsers: item.count || 0,
    lessonsCompleted: lessonRows[index]?.count || 0,
  }))

  const tableColumns = useMemo(
    () => [
      { key: "date", label: "Date", sortable: true },
      { key: "dailyActiveUsers", label: "Daily Active Users", sortable: true },
      { key: "lessonsCompleted", label: "Lessons Completed", sortable: true },
    ],
    []
  )

  const exportCsv = () =>
    exportRowsToCsv("engagement-daily", [
      { key: "date", label: "Date" },
      { key: "dailyActiveUsers", label: "Daily Active Users" },
      { key: "lessonsCompleted", label: "Lessons Completed" },
    ], tableRows)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <ReportHeaderFilters
          title="Engagement Report"
          subtitle="Daily activity, completions, and average session time."
          startDate={range.startDate}
          endDate={range.endDate}
          onDateChange={(key, value) => setRange((prev) => ({ ...prev, [key]: value }))}
          onExport={exportCsv}
        />

        {isLoading ? (
          <ReportCardSkeleton height="h-28" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportKpiCard label="Avg Session Time (mins)" value={data?.avgSessionTime || 0} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </>
          ) : (
            <>
              <div className="card">
                <h2 className="text-lg font-bold text-[#0f172a]">Daily Active Users</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dauRows}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="count" type="monotone" stroke="#0ea5a4" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-bold text-[#0f172a]">Lessons Completed</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lessonRows}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? <ReportCardSkeleton /> : <ReportTable columns={tableColumns} rows={tableRows} emptyText="No engagement data in this range." />}
      </div>
    </div>
  )
}

export default EngagementReport


