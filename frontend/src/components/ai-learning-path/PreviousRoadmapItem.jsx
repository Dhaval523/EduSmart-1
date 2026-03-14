import React from "react";
import { Clock } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export const PreviousRoadmapItem = ({ item, isActive, onSelect }) => {
  const dateLabel = formatDate(item.updatedAt || item.createdAt);
  const meta = [
    item.skillLevel || "Level",
    item.phaseCount ? `${item.phaseCount} phases` : null,
    dateLabel
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-2xl border p-4 text-left transition-colors",
        isActive
          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold leading-snug">
            {item.goal || item.title || "Learning roadmap"}
          </p>
          <p className="mt-1 text-xs text-slate-500">{meta || "Updated recently"}</p>
        </div>
        <span
          className={[
            "inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-semibold",
            isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"
          ].join(" ")}
        >
          <Clock className="h-4 w-4" />
          View
        </span>
      </div>
    </button>
  );
};
