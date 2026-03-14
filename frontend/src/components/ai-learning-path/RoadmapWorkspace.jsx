import React from "react";

export const RoadmapWorkspace = ({ children }) => {
  return (
    <div className="flex-1 min-h-0 bg-slate-50 overflow-hidden">
      <div className="w-full h-full px-6 py-6">
        <div className="h-full rounded-3xl border border-slate-200 bg-white shadow-sm p-6 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
