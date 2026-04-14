import React from "react";
import { ShieldCheck } from "lucide-react";

export const PrerequisitesSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0ea5a4] text-[#f59e0b]">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-[#0f172a]">Prerequisites</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-[#0f172a]">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-[#f59e0b]" />
            <span className="leading-relaxed">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};







