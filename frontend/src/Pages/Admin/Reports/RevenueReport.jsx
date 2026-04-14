import ReportHeaderFilters from "@/components/reports/ReportHeaderFilters"
import ReportKpiCard from "@/components/reports/ReportKpiCard"
import { ReportCardSkeleton, ReportEmpty } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useRevenueReport } from "@/hooks/report.hook"
import { defaultReportRange, exportRowsToCsv, formatINR } from "@/utils/report"
import React, { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const RevenueReport = () => {
  const [range, setRange] = useState(defaultReportRange())
  const { data, isLoading } = useRevenueReport(range.startDate, range.endDate)

  const rows = data?.revenueByCourse || []
  const chartRows = data?.revenueByDate || []
  const barRows = rows.slice(0, 10)

  const tableColumns = useMemo(
    () => [
      { key: "courseName", label: "Course Name", sortable: true },
      { key: "revenue", label: "Revenue", sortable: true, render: (value) => formatINR(value) },
    ],
    []
  )

  const exportCsv = () =>
    exportRowsToCsv("revenue-by-course", [
      { key: "courseName", label: "Course Name" },
      { key: "revenue", label: "Revenue" },
    ], rows)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <ReportHeaderFilters
          title="Revenue Report"
          subtitle="Track total revenue trends and top-performing courses."
          startDate={range.startDate}
          endDate={range.endDate}
          onDateChange={(key, value) => setRange((prev) => ({ ...prev, [key]: value }))}
          onExport={exportCsv}
        />

        {isLoading ? (
          <ReportCardSkeleton height="h-28" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportKpiCard label="Total Revenue" value={formatINR(data?.totalRevenue || 0)} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </>
          ) : chartRows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <>
              <div className="card">
                <h2 className="text-lg font-bold text-[#0f172a]">Revenue Over Time</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartRows}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatINR(value), "Revenue"]} />
                      <Line dataKey="amount" type="monotone" stroke="#0ea5a4" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-bold text-[#0f172a]">Revenue by Course</h2>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barRows}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="courseName" hide />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatINR(value), "Revenue"]} />
                      <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? <ReportCardSkeleton /> : <ReportTable columns={tableColumns} rows={rows} emptyText="No revenue by course in this range." />}
      </div>
    </div>
  )
}

export default RevenueReport


