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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5B7A1]">
            Roadmap overview
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1F2937]">
            {roadmap?.title || "Your Learning Roadmap"}
          </h2>
          {roadmap?.summary ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6B7280]">
              {roadmap.summary}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
          <div className="rounded-2xl border border-gray-200 bg-[#FFF2EE] px-4 py-3">
            <p className="text-xs font-semibold text-[#6B7280]">Level</p>
            <p className="mt-1 text-sm font-extrabold text-[#1F2937]">{roadmap?.level || "N/A"}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#FFF2EE] px-4 py-3">
            <p className="text-xs font-semibold text-[#6B7280]">Estimated duration</p>
            <p className="mt-1 text-sm font-extrabold text-[#1F2937]">
              {roadmap?.estimated_duration || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#FFF2EE] px-4 py-3">
            <p className="text-xs font-semibold text-[#6B7280]">Time / week</p>
            <p className="mt-1 text-sm font-extrabold text-[#1F2937]">
              {roadmap?.learning_time_per_week || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#FFF2EE] px-4 py-3">
            <p className="text-xs font-semibold text-[#6B7280]">Target outcome</p>
            <p className="mt-1 text-sm font-extrabold text-[#1F2937]">
              {roadmap?.target_outcome || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#A29BFE] via-[#D9D4FF] to-[#E5E7EB]" />
          <div className="space-y-6">
            {phases.map((phase) => {
              const status = phaseProgress?.[phase.id] || "not_started";
              const isUpdating = updatingPhaseId === phase.id;
              return (
                <div key={phase.id} className="relative pl-12">
                  <div className="absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F5B7A1] text-[#1F2937] shadow-sm ring-4 ring-[#FFE3DA]">
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
              <div className="rounded-3xl border border-dashed border-gray-200 bg-[#F7F7FB] p-6 text-sm text-[#6B7280]">
                No phases available to render. Try regenerating your roadmap.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
          <Flag className="h-4 w-4" />
          Your roadmap progresses from fundamentals to application and job-readiness.
        </div>
      </div>
    </div>
  );
};








