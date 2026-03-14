import React from "react";

export const RoadmapPageLayout = ({ left, right }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr] items-start">
      <div className="min-h-[520px]">{left}</div>
      <div className="min-h-[520px]">{right}</div>
    </div>
  );
};
