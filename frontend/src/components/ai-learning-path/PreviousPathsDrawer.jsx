import React from "react";
import { X } from "lucide-react";
import { PreviousRoadmapItem } from "./PreviousRoadmapItem";

export const PreviousPathsDrawer = ({
  isOpen,
  onClose,
  items,
  isLoading,
  selectedId,
  onSelect,
  onRefresh
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-[#6C5DD3]/40" onClick={onClose} />
      <div className="relative z-50 h-full w-full max-w-md bg-[#F7F7FB] shadow-md border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6C5DD3]">
              Previous paths
            </p>
            <p className="text-sm font-bold text-[#1F2937]">Your saved roadmaps</p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                className="text-xs font-semibold text-[#F5B7A1] hover:text-[#F5B7A1] transition-colors"
              >
                Refresh
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 text-[#6B7280]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-[#F7F7FB] p-4"
                >
                  <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-[#6B7280]">
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
    </div>
  );
};






