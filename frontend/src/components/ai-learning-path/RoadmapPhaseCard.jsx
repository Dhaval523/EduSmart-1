import React from "react";
import { Clock, Target, Wrench, CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import { PhaseActionBar } from "./PhaseActionBar";

const Pill = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-slate-700">
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Phase {phase.id}
          </p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
            {phase.title || "Untitled phase"}
          </h3>
        </div>
        {phase.duration ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-semibold text-slate-800">
            <Clock className="h-4 w-4 text-yellow-700" />
            {phase.duration}
          </div>
        ) : null}
      </div>

      {phase.objective ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Target className="h-4 w-4" />
            Objective
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">{phase.objective}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-900">
            <ListChecks className="h-4 w-4 text-slate-700" />
            Topics
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase.topics?.length ? (
              phase.topics.map((t) => <Pill key={t} label={t} />)
            ) : (
              <span className="text-sm text-slate-500">No topics listed</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-900">
            <Wrench className="h-4 w-4 text-slate-700" />
            Tools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase.tools?.length ? (
              phase.tools.map((t) => <Pill key={t} label={t} />)
            ) : (
              <span className="text-sm text-slate-500">Tooling is flexible for this phase</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-900">
            <FolderKanban className="h-4 w-4 text-slate-700" />
            Projects
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {phase.projects?.length ? (
              phase.projects.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No projects listed</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            Outcome
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
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

