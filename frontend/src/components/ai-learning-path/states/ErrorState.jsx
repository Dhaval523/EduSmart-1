import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#1F2937]">We couldnt generate your roadmap</p>
          <p className="mt-1 text-sm text-[#1F2937]">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#6C5DD3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B4FC4] transition-colors"
            >
              Retry
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};







