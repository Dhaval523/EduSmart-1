import React from "react";

const LearningPathCard = ({ title, steps, onStartLearning }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#f59e0b] font-semibold">AI Learning Path</p>
          <h3 className="text-xl font-bold text-[#0f172a] mt-1">{title}</h3>
        </div>
        {onStartLearning && (
          <button
            type="button"
            onClick={onStartLearning}
            className="px-4 py-2 text-sm font-semibold bg-[#f59e0b] text-[#0f172a] rounded-lg hover:bg-[#fbbf24] transition-colors"
          >
            Start Learning
          </button>
        )}
      </div>

      <div className="mt-6 relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[#f59e0b]" />
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={`${step}-${index}`} className="relative pl-10">
              <span className="absolute left-0 top-1 h-6 w-6 rounded-full bg-[#f59e0b] text-[#0f172a] text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-[#0f172a]">Step {index + 1}</p>
                <p className="text-base text-[#51607b] mt-1">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;






