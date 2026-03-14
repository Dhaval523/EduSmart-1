import React from "react";
import { Flag } from "lucide-react";
import { RoadmapPhaseCard } from "./RoadmapPhaseCard";

export const RoadmapTimeline = ({
  roadmap,
  phaseProgress,
  onStartLearningPhase,
  onViewCoursesPhase,
  onMarkPhaseComplete,
  updatingPhaseId
}) => {
  const phases = roadmap?.phases || [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">
            Roadmap overview
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {roadmap?.title || "Your Learning Roadmap"}
          </h2>
          {roadmap?.summary ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {roadmap.summary}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">Level</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{roadmap?.level || "—"}</p>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">Estimated duration</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {roadmap?.estimated_duration || "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">Time / week</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {roadmap?.learning_time_per_week || "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">Target outcome</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {roadmap?.target_outcome || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-300 via-yellow-200 to-slate-200" />
          <div className="space-y-6">
            {phases.map((phase) => {
              const status = phaseProgress?.[phase.id] || "not_started";
              const isUpdating = updatingPhaseId === phase.id;
              return (
                <div key={phase.id} className="relative pl-12">
                  <div className="absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 text-slate-900 shadow-sm ring-4 ring-amber-100">
                    <span className="text-sm font-black">{phase.id}</span>
                  </div>
                  <RoadmapPhaseCard
                    phase={phase}
                    status={status}
                    isUpdating={isUpdating}
                    onStartLearning={() => onStartLearningPhase?.(phase)}
                    onViewCourses={() => onViewCoursesPhase?.(phase)}
                    onMarkComplete={() => onMarkPhaseComplete?.(phase)}
                  />
                </div>
              );
            })}

            {phases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No phases available to render. Try regenerating your roadmap.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Flag className="h-4 w-4" />
          Your roadmap progresses from fundamentals to application and job-readiness.
        </div>
      </div>
    </div>
  );
};

