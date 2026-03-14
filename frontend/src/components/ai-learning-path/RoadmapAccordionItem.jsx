import React from "react";
import { Clock, Target, Wrench, CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { PhaseActionBar } from "./PhaseActionBar";

const Pill = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-slate-700">
    {label}
  </span>
);

const StatusBadge = ({ status }) => {
  const label =
    status === "completed" ? "Completed" : status === "in_progress" ? "In progress" : "Not started";
  const classes =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "in_progress"
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-semibold ${classes}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
};

export const RoadmapAccordionItem = ({
  phase,
  status,
  isUpdating,
  onStartLearning,
  onViewCourses,
  onMarkComplete
}) => {
  return (
    <AccordionItem value={`phase-${phase.id}`} className="rounded-2xl border border-slate-200 bg-white px-5">
      <AccordionTrigger className="py-5 hover:no-underline">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-slate-900">
              {phase.id}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phase {phase.id}
              </p>
              <p className="text-base font-extrabold text-slate-900">
                {phase.title || "Untitled phase"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {phase.duration ? (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-slate-800">
                <Clock className="h-4 w-4 text-yellow-700" />
                {phase.duration}
              </span>
            ) : null}
            <StatusBadge status={status} />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-5">
        {phase.objective ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
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
      </AccordionContent>
    </AccordionItem>
  );
};
