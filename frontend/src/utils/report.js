export const toInputDate = (date) => date.toISOString().split("T")[0]

export const defaultReportRange = (days = 30) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - (days - 1))
  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end),
  }
}

export const exportRowsToCsv = (filename, columns, rows) => {
  const header = columns.map((c) => c.label).join(",")
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = row[c.key] ?? ""
          const value = String(raw).replace(/"/g, '""')
          return `"${value}"`
        })
        .join(",")
    )
    .join("\n")

  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

