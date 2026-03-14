import React, { useMemo, useState } from "react";
import { Plus, Wand2 } from "lucide-react";

const defaultTopics = [
  "SQL",
  "Python",
  "Excel",
  "Power BI",
  "Tableau",
  "Statistics",
  "Data Visualization",
  "Machine Learning",
  "Data Cleaning",
  "Business Analysis"
];

const SectionLabel = ({ title, optional, hint }) => (
  <div className="mb-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-800">{title}</label>
      {optional ? (
        <span className="text-xs font-semibold text-slate-500">Optional</span>
      ) : null}
    </div>
    {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
  </div>
);

const TopicChip = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors",
      active
        ? "bg-yellow-400 text-slate-900 border-yellow-400"
        : "bg-yellow-50 text-slate-700 border-yellow-200 hover:bg-yellow-100"
    ].join(" ")}
  >
    {label}
  </button>
);

export const LearningPathForm = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
  showSubmit = true,
  showHeader = true
}) => {
  const [customTopic, setCustomTopic] = useState("");

  const topicsSelected = value.preferredTopics ?? [];
  const topicOptions = useMemo(
    () => Array.from(new Set([...defaultTopics, ...topicsSelected])).sort(),
    [topicsSelected]
  );

  const setField = (key, v) => {
    onChange({ ...value, [key]: v });
  };

  const toggleTopic = (topic) => {
    const next = topicsSelected.includes(topic)
      ? topicsSelected.filter((t) => t !== topic)
      : [...topicsSelected, topic];
    setField("preferredTopics", next);
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (!trimmed) return;
    if (!topicsSelected.includes(trimmed)) {
      setField("preferredTopics", [...topicsSelected, trimmed]);
    }
    setCustomTopic("");
  };

  const onTrySubmit = () => {
    onSubmit();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {showHeader ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-700">
            Roadmap generator
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
            Build your personalized plan
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Preferred topics are optional — leave them empty and the AI will choose the best topics for your
            goal.
          </p>
        </>
      ) : null}

      <div className="mt-6 space-y-5">
        <div>
          <SectionLabel
            title="Learning goal / target role"
            hint="Example: Become a Data Analyst"
          />
          <input
            value={value.goal}
            onChange={(e) => setField("goal", e.target.value)}
            type="text"
            placeholder="Become a Data Analyst"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div>
          <SectionLabel title="Skill level" hint="Select your current skill level" />
          <select
            value={value.level}
            onChange={(e) => setField("level", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <SectionLabel
            title="Preferred topics"
            optional
            hint={
              topicsSelected.length === 0
                ? "No topics selected. AI will choose the best topics for your goal."
                : "AI will prioritize the topics you selected."
            }
          />
          <div className="flex flex-wrap gap-2">
            {topicOptions.map((topic) => (
              <TopicChip
                key={topic}
                label={topic}
                active={topicsSelected.includes(topic)}
                onClick={() => toggleTopic(topic)}
              />
            ))}
          </div>

          <div className="mt-3 flex gap-3">
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              type="text"
              placeholder="Add a topic (optional)"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button
              type="button"
              onClick={addCustomTopic}
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <SectionLabel title="Learning time per week" optional hint="Example: 8-10 hours" />
            <input
              value={value.learningTimePerWeek ?? ""}
              onChange={(e) => setField("learningTimePerWeek", e.target.value)}
              type="text"
              placeholder="8-10 hours"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
          <div>
            <SectionLabel title="Target outcome" optional hint="Example: Job-ready" />
            <input
              value={value.targetOutcome ?? ""}
              onChange={(e) => setField("targetOutcome", e.target.value)}
              type="text"
              placeholder="Job-ready"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
        </div>

        <div>
          <SectionLabel title="Learning style" optional hint="Example: Project-based" />
          <input
            value={value.learningStyle ?? ""}
            onChange={(e) => setField("learningStyle", e.target.value)}
            type="text"
            placeholder="Project-based"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {showSubmit ? (
          <>
            <button
              type="button"
              onClick={onTrySubmit}
              disabled={!!isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Generating roadmap..." : "Generate roadmap"}
            </button>

            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="h-4 w-4 rounded-full border-2 border-yellow-300 border-t-transparent animate-spin" />
                Gemini is creating a structured plan with phases, projects and milestones…
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};
