import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

const statusColor = (status) => {
  if (status === "completed") return "text-emerald-600";
  if (status === "in_progress") return "text-indigo-600";
  return "text-slate-400";
};

export const PhaseNavigationList = ({ phases, selectedId, phaseProgress, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-2">
      {phases.map((phase) => {
        const status = phaseProgress?.[phase.id] || "not_started";
        const isActive = selectedId === phase.id;
        const Icon = status === "completed" ? CheckCircle2 : Circle;
        return (
          <button
            key={phase.id}
            type="button"
            onClick={() => onSelect?.(phase)}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50"
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Phase {phase.id}
                </p>
                <p className="mt-1 text-sm font-semibold line-clamp-2">
                  {phase.title || "Untitled phase"}
                </p>
                {phase.duration ? (
                  <p className="mt-1 text-xs text-slate-500">{phase.duration}</p>
                ) : null}
              </div>
              <Icon className={`h-5 w-5 ${statusColor(status)}`} />
            </div>
          </button>
        );
      })}

      {phases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          No phases available yet.
        </div>
      ) : null}
    </div>
  );
};
