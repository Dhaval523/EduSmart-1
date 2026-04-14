import React from "react"

const ReportKpiCard = ({ label, value }) => (
  <div className="card">
    <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.16em]">{label}</p>
    <p className="text-2xl md:text-3xl font-black text-[#0f172a] mt-3">{value}</p>
  </div>
)

export default ReportKpiCard


