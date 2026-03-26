import React from "react";

export const RoadmapWorkspace = ({ children }) => {
  return (
    <div className="flex-1 min-h-0 bg-transparent overflow-hidden">
      <div className="w-full h-full">
        <div className="h-full rounded-3xl border border-gray-200 bg-white shadow-sm p-6 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};



