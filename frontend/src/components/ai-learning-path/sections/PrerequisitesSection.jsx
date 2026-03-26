import React from "react";
import { ShieldCheck } from "lucide-react";

export const PrerequisitesSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#6C5DD3] text-[#F5B7A1]">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-[#1F2937]">Prerequisites</h3>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-[#1F2937]">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F5B7A1]" />
            <span className="leading-relaxed">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};






