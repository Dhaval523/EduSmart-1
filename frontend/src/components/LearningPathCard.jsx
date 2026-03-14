import React from "react";

const LearningPathCard = ({ title, steps, onStartLearning }) => {
  return (
    <div className="bg-white border border-yellow-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-yellow-700 font-semibold">AI Learning Path</p>
          <h3 className="text-xl font-bold text-zinc-900 mt-1">{title}</h3>
        </div>
        {onStartLearning && (
          <button
            type="button"
            onClick={onStartLearning}
            className="px-4 py-2 text-sm font-semibold bg-yellow-400 text-zinc-900 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Start Learning
          </button>
        )}
      </div>

      <div className="mt-6 relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-yellow-200" />
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={`${step}-${index}`} className="relative pl-10">
              <span className="absolute left-0 top-1 h-6 w-6 rounded-full bg-yellow-400 text-zinc-900 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-800">Step {index + 1}</p>
                <p className="text-base text-zinc-700 mt-1">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;
