import React from "react";
import { Sparkles } from "lucide-react";

export const LearningPathHeader = ({ roadmap }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-[#F7F5FF] via-white to-[#EDEBFF] p-6 shadow-sm">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#A29BFE]/30 blur-2xl" />
      <div className="absolute -left-12 -bottom-16 h-44 w-44 rounded-full bg-[#F5B7A1]/30 blur-2xl" />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#F5B7A1]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5B7A1] text-[#1F2937] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            Smart Tutor Academy
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1F2937] md:text-4xl">
            AI Learning Roadmap
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
            Generate a premium, job-oriented roadmap tailored to your goal and skill level. Prefer topics
            if you want - or leave them empty and the AI will pick the best path automatically.
          </p>
        </div>

        {roadmap?.title ? (
          <div className="hidden md:block min-w-[260px] rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur">
            <p className="text-xs font-semibold text-[#6B7280]">Current roadmap</p>
            <p className="mt-1 line-clamp-2 text-sm font-bold text-[#1F2937]">{roadmap.title}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-[#FFF2EE] px-3 py-2">
                <p className="text-[#6B7280]">Level</p>
                <p className="font-semibold text-[#1F2937]">{roadmap.level || "-"}</p>
              </div>
              <div className="rounded-xl bg-[#FFF2EE] px-3 py-2">
                <p className="text-[#6B7280]">Phases</p>
                <p className="font-semibold text-[#1F2937]">{roadmap.phases?.length ?? 0}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};








