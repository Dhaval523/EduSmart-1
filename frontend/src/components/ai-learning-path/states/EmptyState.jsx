import React from "react";
import { Brain, ArrowRight } from "lucide-react";

export const EmptyState = ({ onTryExample }) => {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde68a] text-[#0f172a]">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">Your roadmap will appear here</h2>
            <p className="mt-1 text-sm text-[#51607b]">
              Fill in your goal and skill level, then generate a structured learning plan with phases,
              projects, and job-readiness milestones.
            </p>
          </div>
        </div>

        {onTryExample ? (
          <button
            type="button"
            onClick={onTryExample}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#fbbf24] transition-colors"
          >
            Try example
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};







