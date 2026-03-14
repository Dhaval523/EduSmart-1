import React from "react";

export const RoadmapProgressCard = ({ roadmap, phaseProgress, currentPhaseId }) => {
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
    <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          Roadmap progress
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-black text-white">{completedCount}</p>
          <p className="text-sm font-semibold text-slate-300">
            / {total} phases completed
          </p>
        </div>
        {currentPhase ? (
          <p className="mt-2 text-xs text-slate-200">
            Current phase:{" "}
            <span className="font-semibold">
              {currentPhase.id}. {currentPhase.title}
            </span>
          </p>
        ) : null}
      </div>

      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
          <span>Overall progress</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-amber-400 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

