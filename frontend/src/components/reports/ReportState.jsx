import React from "react"

export const ReportCardSkeleton = ({ height = "h-72" }) => (
  <div className={`card animate-pulse ${height}`}>
    <div className="h-4 w-32 bg-gray-200 rounded" />
    <div className="h-full mt-4 bg-gray-100 rounded-xl" />
  </div>
)

export const ReportEmpty = ({ text = "No report data available for this range." }) => (
  <div className="card">
    <p className="text-sm text-[#51607b]">{text}</p>
  </div>
)


