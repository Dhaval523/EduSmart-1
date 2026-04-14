import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { RoadmapAccordionItem } from "./RoadmapAccordionItem";

export const RoadmapAccordion = ({
  roadmap,
  phaseProgress,
  onStartLearningPhase,
  onViewCoursesPhase,
  onMarkPhaseComplete,
  updatingPhaseId
}) => {
  const phases = roadmap?.phases || [];
  const defaultValue = phases.length ? `phase-${phases[0].id}` : undefined;

  if (!phases.length) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-[#f5f7fb] p-6 text-sm text-[#51607b]">
        No phases available to render. Try regenerating your roadmap.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible defaultValue={defaultValue} className="space-y-4">
      {phases.map((phase) => {
        const status = phaseProgress?.[phase.id] || "not_started";
        const isUpdating = updatingPhaseId === phase.id;
        return (
          <RoadmapAccordionItem
            key={phase.id}
            phase={phase}
            status={status}
            isUpdating={isUpdating}
            onStartLearning={() => onStartLearningPhase?.(phase)}
            onViewCourses={() => onViewCoursesPhase?.(phase)}
            onMarkComplete={() => onMarkPhaseComplete?.(phase)}
          />
        );
      })}
    </Accordion>
  );
};




