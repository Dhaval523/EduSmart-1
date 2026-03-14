import React from "react";
import { ShieldCheck } from "lucide-react";

export const PrerequisitesSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-yellow-300">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-slate-900">Prerequisites</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-yellow-400" />
            <span className="leading-relaxed">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

