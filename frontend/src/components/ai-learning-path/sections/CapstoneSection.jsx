import React from "react";
import { Trophy } from "lucide-react";

export const CapstoneSection = ({ capstone }) => {
  const title = capstone?.title?.trim() || "";
  const description = capstone?.description?.trim() || "";
  if (!title && !description) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-yellow-50 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-400 text-slate-900">
          <Trophy className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-slate-900">Capstone project</h3>
      </div>
      <div className="mt-4 rounded-2xl border border-yellow-200 bg-white/70 p-4">
        {title ? <p className="text-sm font-extrabold text-slate-900">{title}</p> : null}
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

