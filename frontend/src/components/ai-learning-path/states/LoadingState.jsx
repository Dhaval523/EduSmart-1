import React from "react";

export const LoadingState = () => {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-44 rounded-full bg-gray-200" />
            <div className="h-7 w-72 rounded-2xl bg-gray-200" />
          </div>
          <div className="h-9 w-28 rounded-2xl bg-[#f59e0b]" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-gray-200" />
          <div className="h-4 w-11/12 rounded-full bg-gray-200" />
          <div className="h-4 w-9/12 rounded-full bg-gray-200" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="relative rounded-2xl border border-gray-200 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-2xl bg-[#f59e0b]" />
                <div className="h-4 w-56 rounded-full bg-gray-200" />
              </div>
              <div className="h-4 w-10/12 rounded-full bg-gray-200" />
              <div className="mt-2 h-4 w-9/12 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};







