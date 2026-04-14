import React from "react";
import { ExternalLink, Library } from "lucide-react";

const badge = (type) => {
  const map = {
    course: "Course",
    article: "Article",
    book: "Book",
    video: "Video",
    project: "Project",
    tool: "Tool",
    other: "Resource"
  };
  return map[type] ?? "Resource";
};

export const ResourcesSection = ({ resources }) => {
  if (!resources?.length) return null;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fde68a] text-[#0f172a]">
          <Library className="h-4 w-4" />
        </span>
        <h3 className="text-base font-extrabold text-[#0f172a]">Recommended resources</h3>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {resources.map((r, idx) => (
          <div
            key={`${r.title}-${idx}`}
            className="rounded-2xl border border-gray-200 bg-[#f5f7fb] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#51607b]">
                  {badge(r.type)}
                </p>
                <p className="mt-1 text-sm font-bold text-[#0f172a]">{r.title}</p>
              </div>
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] hover:bg-[#fef3c7] transition-colors"
                >
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};






