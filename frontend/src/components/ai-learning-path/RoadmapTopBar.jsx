import React from "react";
import { History, Plus } from "lucide-react";

export const RoadmapTopBar = ({ onOpenGenerate, onOpenHistory }) => {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="w-full px-6 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          AI Roadmap Workspace
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 order-first sm:order-none">
          <button
            type="button"
            onClick={onOpenGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Generate Roadmap
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <History className="h-4 w-4" />
            Previous Paths
          </button>
        </div>
      </div>
    </div>
  );
};
