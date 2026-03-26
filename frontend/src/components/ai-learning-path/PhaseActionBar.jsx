import React from "react";
import { PlayCircle, BookOpenCheck, CheckCircle2 } from "lucide-react";

const statusLabel = (status) => {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  return "Not started";
};

const statusClasses = (status) => {
  if (status === "completed") {
    return "bg-[#F7F5FF] text-[#6C5DD3] border-gray-200";
  }
  if (status === "in_progress") {
    return "bg-[#F7F5FF] text-[#6C5DD3] border-gray-200";
  }
  return "bg-[#F7F7FB] text-[#6B7280] border-gray-200";
};

export const PhaseActionBar = ({
  status,
  onStartLearning,
  onViewCourses,
  onMarkComplete,
  isUpdating
}) => {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isUpdating}
          onClick={onStartLearning}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#6C5DD3] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5B4FC4] transition-colors disabled:opacity-70"
        >
          <PlayCircle className="h-4 w-4" />
          Start learning
        </button>
        <button
          type="button"
          disabled={isUpdating}
          onClick={onViewCourses}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#6C5DD3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5B4FC4] transition-colors disabled:opacity-70"
        >
          <BookOpenCheck className="h-4 w-4" />
          View courses
        </button>
        <button
          type="button"
          disabled={isUpdating || status === "completed"}
          onClick={onMarkComplete}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F7F7FB] transition-colors disabled:opacity-60"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark complete
        </button>
      </div>

      <div
        className={[
          "inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold",
          statusClasses(status)
        ].join(" ")}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {statusLabel(status)}
      </div>
    </div>
  );
};







