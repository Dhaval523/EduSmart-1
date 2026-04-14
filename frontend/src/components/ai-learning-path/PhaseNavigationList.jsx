import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

const statusColor = (status) => {
  if (status === "completed") return "text-[#0ea5a4]";
  if (status === "in_progress") return "text-[#0ea5a4]";
  return "text-gray-400";
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
                ? "border-[#0ea5a4] bg-[#0ea5a4] text-white"
                : "border-gray-200 bg-white hover:bg-[#f5f7fb]"
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
                  <p className="mt-1 text-xs text-[#51607b]">{phase.duration}</p>
                ) : null}
              </div>
              <Icon className={`h-5 w-5 ${statusColor(status)}`} />
            </div>
          </button>
        );
      })}

      {phases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#f5f7fb] p-4 text-sm text-[#51607b]">
          No phases available yet.
        </div>
      ) : null}
    </div>
  );
};






