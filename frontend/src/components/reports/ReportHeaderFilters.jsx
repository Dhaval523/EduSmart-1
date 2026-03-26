import { Download } from "lucide-react"
import React from "react"

const ReportHeaderFilters = ({
  title,
  subtitle,
  startDate,
  endDate,
  onDateChange,
  onExport,
  hideDateFilter = false,
}) => {
  return (
    <div className="card space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-[#1F2937]">{title}</h1>
        {subtitle ? <p className="text-sm text-[#6B7280]">{subtitle}</p> : null}
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-3 md:justify-between">
        {hideDateFilter ? <div /> : (
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.12em]">
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateChange("startDate", e.target.value)}
                className="mt-1 block w-full sm:w-44 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.12em]">
              End Date
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateChange("endDate", e.target.value)}
                className="mt-1 block w-full sm:w-44 px-3 py-2 text-sm"
              />
            </label>
          </div>
        )}

        {onExport ? (
          <button onClick={onExport} className="btn-secondary inline-flex items-center gap-2 w-fit">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ReportHeaderFilters

