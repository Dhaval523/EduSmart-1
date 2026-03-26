import React from "react"

const ReportKpiCard = ({ label, value }) => (
  <div className="card">
    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.16em]">{label}</p>
    <p className="text-2xl md:text-3xl font-black text-[#1F2937] mt-3">{value}</p>
  </div>
)

export default ReportKpiCard

