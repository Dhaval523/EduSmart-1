import React from "react";
import { X } from "lucide-react";
import { LearningPathForm } from "@/components/ai-learning-path/LearningPathForm";

export const GenerateRoadmapDrawer = ({
  isOpen,
  onClose,
  value,
  onChange,
  onSubmit,
  isLoading,
  error
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-[#0ea5a4]/40" onClick={onClose} />
      <div className="relative z-50 h-full w-full max-w-lg bg-[#f5f7fb] shadow-md border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0ea5a4]">
              Generate Roadmap
            </p>
            <p className="text-sm font-bold text-[#0f172a]">Create a new learning path</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 text-[#51607b]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <LearningPathForm
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            showSubmit={false}
            showHeader={false}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#f5f7fb] disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="rounded-2xl bg-[#0ea5a4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f766e] disabled:opacity-70"
          >
            {isLoading ? "Generating..." : "Generate roadmap"}
          </button>
        </div>
      </div>
    </div>
  );
};







