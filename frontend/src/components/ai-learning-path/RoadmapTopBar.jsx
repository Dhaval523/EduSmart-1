import React from "react";
import { History, Plus } from "lucide-react";

export const RoadmapTopBar = ({ onOpenGenerate, onOpenHistory }) => {
  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="w-full px-0 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#51607b]">
          AI Roadmap Workspace
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 order-first sm:order-none">
          <button
            type="button"
            onClick={onOpenGenerate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0ea5a4] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0f766e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Generate Roadmap
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0f172a] hover:bg-[#f5f7fb] transition-colors"
          >
            <History className="h-4 w-4" />
            Previous Paths
          </button>
        </div>
      </div>
    </div>
  );
};





