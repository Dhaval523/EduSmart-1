import React from "react";
import { Clock, Target, Wrench, CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import { PhaseActionBar } from "./PhaseActionBar";

const Pill = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-[#fef3c7] px-3 py-1 text-xs font-semibold text-[#0f172a]">
    {label}
  </span>
);

export const PhaseDetailPanel = ({
  phase,
  status,
  isUpdating,
  onStartLearning,
  onViewCourses,
  onMarkComplete
}) => {
  if (!phase) {
    return (
      <div className="h-full rounded-3xl border border-dashed border-gray-200 bg-[#f5f7fb] p-6 text-sm text-[#51607b]">
        Select a phase to see the details.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#51607b]">
              Phase {phase.id}
            </p>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#0f172a]">
              {phase.title || "Untitled phase"}
            </h3>
          </div>
          {phase.duration ? (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#fef3c7] px-3 py-2 text-xs font-semibold text-[#0f172a]">
              <Clock className="h-4 w-4 text-[#f59e0b]" />
              {phase.duration}
            </div>
          ) : null}
        </div>

        {phase.objective ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f5f7fb] px-4 py-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#51607b]">
              <Target className="h-4 w-4" />
              Objective
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#0f172a]">{phase.objective}</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0f172a]">
              <ListChecks className="h-4 w-4 text-[#0f172a]" />
              Topics
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {phase.topics?.length ? (
                phase.topics.map((t) => <Pill key={t} label={t} />)
              ) : (
                <span className="text-sm text-[#51607b]">No topics listed</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0f172a]">
              <Wrench className="h-4 w-4 text-[#0f172a]" />
              Tools
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {phase.tools?.length ? (
                phase.tools.map((t) => <Pill key={t} label={t} />)
              ) : (
                <span className="text-sm text-[#51607b]">Tooling is flexible for this phase</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0f172a]">
              <FolderKanban className="h-4 w-4 text-[#0f172a]" />
              Projects
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#0f172a]">
              {phase.projects?.length ? (
                phase.projects.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#f59e0b]" />
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#51607b]">No projects listed</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0f172a]">
              <CheckCircle2 className="h-4 w-4 text-[#0ea5a4]" />
              Outcome
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#0f172a]">
              {phase.outcome || "Outcome will be defined as you progress through this phase."}
            </p>
          </div>
        </div>

        <PhaseActionBar
          status={status}
          onStartLearning={onStartLearning}
          onViewCourses={onViewCourses}
          onMarkComplete={onMarkComplete}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
};






