import React from "react"

const LoadingBars = ({ label = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="loading" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {label ? (
        <p className="text-sm font-semibold text-[#0f172a] tracking-tight">{label}</p>
      ) : null}
    </div>
  )
}

export default LoadingBars
