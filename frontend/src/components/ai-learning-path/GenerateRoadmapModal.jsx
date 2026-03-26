import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LearningPathForm } from "@/components/ai-learning-path/LearningPathForm";
import { Wand2 } from "lucide-react";

export const GenerateRoadmapModal = ({
  isOpen,
  onClose,
  value,
  onChange,
  onSubmit,
  isLoading,
  error
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose?.() : null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-[#F7F7FB] p-0">
        <div className="flex flex-col max-h-[85vh]">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-black text-[#1F2937]">
                Generate a New Roadmap
              </DialogTitle>
              <DialogDescription className="text-sm text-[#6B7280]">
                Tell us your goal and optional preferences. We will craft a personalized learning plan.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <LearningPathForm
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
              showSubmit={false}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1F2937] hover:bg-[#F7F7FB] disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#6C5DD3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B4FC4] disabled:opacity-70"
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Generating..." : "Generate roadmap"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};




