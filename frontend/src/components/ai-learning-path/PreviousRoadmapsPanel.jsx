import React from "react";
import { History, Plus } from "lucide-react";
import { PreviousRoadmapItem } from "./PreviousRoadmapItem";

export const PreviousRoadmapsPanel = ({
  items,
  isLoading,
  selectedId,
  onSelect,
  onGenerate,
  onRefresh
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-100 text-slate-900">
            <History className="h-4 w-4" />
          </span>
          <h3 className="text-base font-extrabold text-slate-900">Previous learning paths</h3>
        </div>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-semibold text-yellow-700 hover:text-yellow-600 transition-colors"
          >
            Refresh
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Generate roadmap
      </button>

      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No learning paths yet. Generate your first roadmap to get started.
          </div>
        ) : (
          items.map((item) => (
            <PreviousRoadmapItem
              key={item._id}
              item={item}
              isActive={selectedId === item._id}
              onSelect={() => onSelect?.(item)}
            />
          ))
        )}
      </div>
    </div>
  );
};
