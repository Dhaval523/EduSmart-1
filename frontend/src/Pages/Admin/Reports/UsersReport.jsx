import ReportHeaderFilters from "@/components/reports/ReportHeaderFilters"
import ReportKpiCard from "@/components/reports/ReportKpiCard"
import { ReportCardSkeleton } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useUsersReport } from "@/hooks/report.hook"
import { defaultReportRange, exportRowsToCsv } from "@/utils/report"
import React, { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const UsersReport = () => {
  const [range, setRange] = useState(defaultReportRange())
  const { data, isLoading } = useUsersReport(range.startDate, range.endDate)

  const rows = data?.newUsersByDate || []

  const tableColumns = useMemo(
    () => [
      { key: "date", label: "Date", sortable: true },
      { key: "count", label: "New Users", sortable: true },
    ],
    []
  )

  const exportCsv = () =>
    exportRowsToCsv("new-users-by-date", [
      { key: "date", label: "Date" },
      { key: "count", label: "New Users" },
    ], rows)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <ReportHeaderFilters
          title="Users Report"
          subtitle="Track user growth and active users in the learning app."
          startDate={range.startDate}
          endDate={range.endDate}
          onDateChange={(key, value) => setRange((prev) => ({ ...prev, [key]: value }))}
          onExport={exportCsv}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCardSkeleton height="h-28" />
            <ReportCardSkeleton height="h-28" />
            <ReportCardSkeleton height="h-28" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportKpiCard label="Total Users" value={data?.totalUsers || 0} />
            <ReportKpiCard label="Active Users (7 Days)" value={data?.activeUsers?.last7Days || 0} />
            <ReportKpiCard label="Active Users (30 Days)" value={data?.activeUsers?.last30Days || 0} />
          </div>
        )}

        {isLoading ? (
          <ReportCardSkeleton />
        ) : (
          <div className="card">
            <h2 className="text-lg font-bold text-[#1F2937]">New Users Growth</h2>
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="count" type="monotone" stroke="#6C5DD3" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {isLoading ? <ReportCardSkeleton /> : <ReportTable columns={tableColumns} rows={rows} emptyText="No new users in this range." />}
      </div>
    </div>
  )
}

export default UsersReport

