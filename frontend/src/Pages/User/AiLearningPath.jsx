import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LearningPathCard from "@/components/LearningPathCard";
import { generateLearningPathApi, getLearningPathsApi } from "@/services/ai.api";

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

const AiLearningPath = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [preferredTopics, setPreferredTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState("");
  const [currentPath, setCurrentPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const topicOptions = useMemo(
    () => Array.from(new Set([...defaultTopics, ...preferredTopics])).sort(),
    [preferredTopics]
  );

  const toggleTopic = (topic) => {
    setPreferredTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (!trimmed) return;
    if (!preferredTopics.includes(trimmed)) {
      setPreferredTopics((prev) => [...prev, trimmed]);
    }
    setCustomTopic("");
  };

  const fetchHistory = async () => {
    try {
      const res = await getLearningPathsApi();
      if (res?.success) {
        setHistory(res.paths || []);
      }
    } catch (err) {
      console.error("Failed to load learning path history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("Please enter your learning goal.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const payload = {
        goal: goal.trim(),
        skillLevel,
        preferredTopics
      };
      const res = await generateLearningPathApi(payload);
      if (res?.success) {
        setCurrentPath(res.learningPath || []);
        await fetchHistory();
      } else {
        setError(res?.message || "Unable to generate learning path.");
      }
    } catch (err) {
      console.error("Generate learning path failed", err);
      setError("Unable to generate learning path. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLearning = (seed) => {
    const query = encodeURIComponent(seed || goal || "courses");
    navigate(`/?q=${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white/90 backdrop-blur border border-yellow-200 rounded-3xl p-8 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-700 font-semibold">
              Smart Tutor Academy
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 mt-2">
              AI Learning Path Generator
            </h1>
            <p className="text-zinc-600 mt-2">
              Tell us your goal and preferences, and we will build a personalized roadmap.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Learning Goal</label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  type="text"
                  placeholder="Become a Data Analyst"
                  className="w-full px-4 py-3 rounded-xl border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-yellow-200 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Preferred Topics</label>
                <div className="flex flex-wrap gap-3">
                  {topicOptions.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        preferredTopics.includes(topic)
                          ? "bg-yellow-400 text-zinc-900 border-yellow-400"
                          : "bg-yellow-50 text-zinc-700 border-yellow-200 hover:bg-yellow-100"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-3">
                  <input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    type="text"
                    placeholder="Add a topic"
                    className="flex-1 px-4 py-2 rounded-xl border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  <button
                    type="button"
                    onClick={addCustomTopic}
                    className="px-4 py-2 bg-yellow-200 text-zinc-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-yellow-400 text-zinc-900 font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Generating..." : "Generate Learning Path"}
              </button>

              {isLoading && (
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <span className="h-4 w-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                  Building your roadmap with Gemini AI...
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {currentPath.length > 0 && (
              <LearningPathCard
                title={goal || "Your Learning Path"}
                steps={currentPath}
                onStartLearning={() => handleStartLearning(currentPath[0])}
              />
            )}

            <div className="bg-white border border-yellow-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900">Previous Learning Paths</h2>
                <button
                  type="button"
                  onClick={fetchHistory}
                  className="text-sm font-semibold text-yellow-700 hover:text-yellow-600"
                >
                  Refresh
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-zinc-500 mt-4">No learning paths generated yet.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="border border-yellow-100 rounded-xl p-4 bg-yellow-50/60"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">{item.goal}</p>
                          <p className="text-xs text-zinc-600 mt-1">
                            {item.skillLevel} level • {item.preferredTopics?.length || 0} topics
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentPath(item.generatedPath || [])}
                          className="text-xs font-semibold text-yellow-700 hover:text-yellow-600"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiLearningPath;
