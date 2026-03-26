import React from "react";
import { Clock, Target, Wrench, CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import { PhaseActionBar } from "./PhaseActionBar";

const Pill = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-[#FFF2EE] px-3 py-1 text-xs font-semibold text-[#1F2937]">
    {label}
  </span>
);

export const RoadmapPhaseCard = ({
  phase,
  status,
  onStartLearning,
  onViewCourses,
  onMarkComplete,
  isUpdating
}) => {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            Phase {phase.id}
          </p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight text-[#1F2937]">
            {phase.title || "Untitled phase"}
          </h3>
        </div>
        {phase.duration ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#FFF2EE] px-3 py-2 text-xs font-semibold text-[#1F2937]">
            <Clock className="h-4 w-4 text-[#F5B7A1]" />
            {phase.duration}
          </div>
        ) : null}
      </div>

      {phase.objective ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-[#F7F7FB] px-4 py-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
            <Target className="h-4 w-4" />
            Objective
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#1F2937]">{phase.objective}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1F2937]">
            <ListChecks className="h-4 w-4 text-[#1F2937]" />
            Topics
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase.topics?.length ? (
              phase.topics.map((t) => <Pill key={t} label={t} />)
            ) : (
              <span className="text-sm text-[#6B7280]">No topics listed</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1F2937]">
            <Wrench className="h-4 w-4 text-[#1F2937]" />
            Tools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase.tools?.length ? (
              phase.tools.map((t) => <Pill key={t} label={t} />)
            ) : (
              <span className="text-sm text-[#6B7280]">Tooling is flexible for this phase</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1F2937]">
            <FolderKanban className="h-4 w-4 text-[#1F2937]" />
            Projects
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[#1F2937]">
            {phase.projects?.length ? (
              phase.projects.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F5B7A1]" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))
            ) : (
              <li className="text-[#6B7280]">No projects listed</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1F2937]">
            <CheckCircle2 className="h-4 w-4 text-[#6C5DD3]" />
            Outcome
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#1F2937]">
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
  );
};






