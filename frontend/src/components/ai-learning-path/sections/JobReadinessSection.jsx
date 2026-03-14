import React from "react";
import { Briefcase } from "lucide-react";

export const JobReadinessSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-yellow-300">
          <Briefcase className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-slate-900">Job readiness checklist</h3>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((x) => (
          <div key={x} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400" />
              <p className="text-sm leading-relaxed text-slate-800">{x}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

