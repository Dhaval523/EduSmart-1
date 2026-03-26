import React, { useMemo, useState } from "react"

const ReportTable = ({ columns, rows = [], emptyText = "No data found." }) => {
  const firstSortable = columns.find((col) => col.sortable)?.key || columns[0]?.key
  const [sortBy, setSortBy] = useState(firstSortable)
  const [sortDir, setSortDir] = useState("desc")

  const sortedRows = useMemo(() => {
    const values = [...rows]
    values.sort((a, b) => {
      const left = a?.[sortBy]
      const right = b?.[sortBy]
      if (typeof left === "number" && typeof right === "number") {
        return sortDir === "asc" ? left - right : right - left
      }
      return sortDir === "asc"
        ? String(left ?? "").localeCompare(String(right ?? ""))
        : String(right ?? "").localeCompare(String(left ?? ""))
    })
    return values
  }, [rows, sortBy, sortDir])

  const toggleSort = (key) => {
    if (key !== sortBy) {
      setSortBy(key)
      setSortDir("desc")
      return
    }
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#F7F7FB] text-[#1F2937]">
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-4 py-4 font-semibold whitespace-nowrap"
                >
                  {column.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-[#6C5DD3]"
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.label}
                      {sortBy === column.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-[#6B7280]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="border-b border-gray-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-[#1F2937]">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReportTable

