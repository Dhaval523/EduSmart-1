import React from "react";

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#1F2937]">
    {children}
  </span>
);

export const RoadmapHeader = ({ roadmap, phaseProgress, currentPhaseId }) => {
  const phases = roadmap?.phases || [];
  const total = phases.length || 0;
  const completedCount = phases.filter(
    (p) => phaseProgress?.[p.id] === "completed"
  ).length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  const currentPhase =
    phases.find((p) => p.id === currentPhaseId) ||
    phases.find((p) => phaseProgress?.[p.id] === "in_progress") ||
    phases[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#6B7280]">Active roadmap</p>
          <p className="text-sm font-semibold text-[#1F2937] truncate">
            {roadmap?.title || roadmap?.goal || "Learning roadmap"}
          </p>
        </div>
        {currentPhase ? (
          <p className="text-xs text-[#6B7280]">
            Current: <span className="font-semibold text-[#1F2937]">{currentPhase.id}. {currentPhase.title}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <Chip>Level: {roadmap?.level || "N/A"}</Chip>
        <Chip>Duration: {roadmap?.estimated_duration || "N/A"}</Chip>
        <Chip>Time/week: {roadmap?.learning_time_per_week || "N/A"}</Chip>
        <Chip>Progress: {percent}%</Chip>
        <Chip>Phases: {total || "N/A"}</Chip>
      </div>
    </div>
  );
};





