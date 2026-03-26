import ReportHeaderFilters from "@/components/reports/ReportHeaderFilters"
import { ReportCardSkeleton } from "@/components/reports/ReportState"
import ReportTable from "@/components/reports/ReportTable"
import { useCoursesReport } from "@/hooks/report.hook"
import { exportRowsToCsv } from "@/utils/report"
import React, { useMemo } from "react"

const CoursesReport = () => {
  const { data, isLoading } = useCoursesReport()
  const rows = data?.courses || []

  const tableColumns = useMemo(
    () => [
      { key: "courseName", label: "Course Name", sortable: true },
      { key: "totalEnrollments", label: "Enrollments", sortable: true },
      { key: "completionRate", label: "Completion Rate (%)", sortable: true },
      { key: "averageProgress", label: "Avg Progress (%)", sortable: true },
    ],
    []
  )

  const exportCsv = () =>
    exportRowsToCsv("course-performance", [
      { key: "courseName", label: "Course Name" },
      { key: "totalEnrollments", label: "Enrollments" },
      { key: "completionRate", label: "Completion Rate (%)" },
      { key: "averageProgress", label: "Avg Progress (%)" },
    ], rows)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <ReportHeaderFilters
          title="Course Performance Report"
          subtitle="All-time course performance summary."
          hideDateFilter
          onExport={exportCsv}
        />

        {isLoading ? (
          <ReportCardSkeleton />
        ) : (
          <ReportTable
            columns={tableColumns}
            rows={rows}
            emptyText="No course performance data available."
          />
        )}
      </div>
    </div>
  )
}

export default CoursesReport

