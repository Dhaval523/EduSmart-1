import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateLearningPathApi,
  getLearningPathsApi,
  recommendCoursesForPhaseApi,
  markPhaseCompleteApi,
  startPhaseCourseApi
} from "@/services/ai.api";
import { normalizeRoadmap } from "@/utils/roadmap";
import { RoadmapTopBar } from "@/components/ai-learning-path/RoadmapTopBar";
import { GenerateRoadmapDrawer } from "@/components/ai-learning-path/GenerateRoadmapDrawer";
import { PreviousPathsDrawer } from "@/components/ai-learning-path/PreviousPathsDrawer";
import { RoadmapWorkspace } from "@/components/ai-learning-path/RoadmapWorkspace";
import { RoadmapHeader } from "@/components/ai-learning-path/RoadmapHeader";
import { PhaseNavigationList } from "@/components/ai-learning-path/PhaseNavigationList";
import { PhaseDetailPanel } from "@/components/ai-learning-path/PhaseDetailPanel";
import { RecommendedCoursesDrawer } from "@/components/ai-learning-path/RecommendedCoursesDrawer";
import { EmptyState } from "@/components/ai-learning-path/states/EmptyState";
import { LoadingState } from "@/components/ai-learning-path/states/LoadingState";
import { ErrorState } from "@/components/ai-learning-path/states/ErrorState";

const initialForm = {
  goal: "",
  level: "Beginner",
  preferredTopics: [],
  learningTimePerWeek: "",
  targetOutcome: "",
  learningStyle: ""
};

const mapHistoryToRoadmap = (item) => {
  if (item.roadmap) return normalizeRoadmap(item.roadmap);
  const phases = (item.generatedPath || []).slice(0, 10).map((title, idx) => ({
    id: idx + 1,
    title: String(title || "").trim(),
    duration: "",
    objective: "",
    topics: [],
    tools: [],
    projects: [],
    outcome: ""
  }));
  if (!phases.length) return null;
  return normalizeRoadmap({
    title: `${item.goal || "Learning Path"} (Legacy)`,
    goal: item.goal || "",
    level: item.skillLevel || "",
    estimated_duration: "",
    learning_time_per_week: item.learningTimePerWeek || "",
    target_outcome: item.targetOutcome || "",
    learning_style: item.learningStyle || "",
    prerequisites: [],
    summary:
      "This is a legacy roadmap generated before the structured roadmap upgrade. Generate again for full details.",
    phases,
    resources: [],
    capstone_project: { title: "", description: "" },
    job_readiness: []
  });
};

const decorateHistory = (items = []) =>
  items.map((item) => ({
    ...item,
    phaseCount: item.roadmap?.phases?.length || item.generatedPath?.length || 0
  }));

const AiLearningPathPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [roadmap, setRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [roadmapId, setRoadmapId] = useState(null);
  const [phaseProgress, setPhaseProgress] = useState({});
  const [currentPhaseId, setCurrentPhaseId] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null); // "generate" | "history" | null

  const [recommendations, setRecommendations] = useState([]);
  const [bestMatchCourseId, setBestMatchCourseId] = useState(null);
  const [recommendationError, setRecommendationError] = useState("");
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [updatingPhaseId, setUpdatingPhaseId] = useState(null);

  const canGenerate = useMemo(() => {
    return form.goal.trim().length > 0 && !!form.level;
  }, [form.goal, form.level]);

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await getLearningPathsApi();
      if (res?.success) {
        setHistory(decorateHistory(res.paths || []));
      }
    } catch (e) {
      console.error("Failed to fetch roadmap history", e);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!roadmap?.phases?.length) {
      setSelectedPhase(null);
      return;
    }
    setSelectedPhase((prev) => {
      const match = prev ? roadmap.phases.find((p) => p.id === prev.id) : null;
      return match || roadmap.phases[0];
    });
  }, [roadmap]);

  const syncProgressFromServer = (phasesProgress, currentPhaseIdValue) => {
    const map = {};
    (phasesProgress || []).forEach((p) => {
      map[p.phaseId] = p.status || "not_started";
    });
    setPhaseProgress(map);
    setCurrentPhaseId(currentPhaseIdValue || null);
  };

  const handleGenerate = async () => {
    const goal = form.goal.trim();
    if (!goal) {
      setError("Please enter your learning goal / target role.");
      return;
    }
    if (!form.level) {
      setError("Please select your current skill level.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const payload = {
        goal,
        skillLevel: form.level,
        preferredTopics: form.preferredTopics ?? [],
        learningTimePerWeek: (form.learningTimePerWeek || "").trim(),
        targetOutcome: (form.targetOutcome || "").trim(),
        learningStyle: (form.learningStyle || "").trim()
      };

      const res = await generateLearningPathApi(payload);
      if (!res?.success) {
        setError(res?.message || "Unable to generate roadmap. Please try again.");
        setRoadmap(null);
        return;
      }

      const normalized = res?.roadmap ? normalizeRoadmap(res.roadmap) : null;
      if (normalized) {
        setRoadmap(normalized);
        setRoadmapId(res.learningPathId || null);
        syncProgressFromServer(res.phasesProgress || [], res.currentPhaseId);
        setActiveDrawer(null);
      } else {
        setError("The AI returned an unexpected format. Please try again.");
        setRoadmap(null);
      }
      await fetchHistory();
    } catch (e) {
      console.error("Generate roadmap failed", e);
      setError("Unable to generate roadmap right now. Please try again.");
      setRoadmap(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryExample = () => {
    setForm({
      ...form,
      goal: "Become a Data Analyst",
      level: "Beginner",
      preferredTopics: ["SQL", "Python"],
      learningTimePerWeek: "8-10 hours",
      targetOutcome: "Job-ready",
      learningStyle: "Project-based"
    });
    setActiveDrawer("generate");
  };

  const handleSelectHistory = (item) => {
    const r = mapHistoryToRoadmap(item);
    setRoadmap(r);
    setRoadmapId(item._id);
    const map = {};
    (item.phasesProgress || []).forEach((p) => {
      map[p.phaseId] = p.status || "not_started";
    });
    setPhaseProgress(map);
    setCurrentPhaseId(item.currentPhaseId || null);

    setForm((prev) => ({
      ...prev,
      goal: item.goal || prev.goal,
      level: item.skillLevel || prev.level,
      preferredTopics: item.preferredTopics ?? prev.preferredTopics,
      learningTimePerWeek: item.learningTimePerWeek ?? prev.learningTimePerWeek,
      targetOutcome: item.targetOutcome ?? prev.targetOutcome,
      learningStyle: item.learningStyle ?? prev.learningStyle
    }));
    setActiveDrawer(null);
  };

  const fetchRecommendations = async (phase) => {
    if (!roadmap || !roadmapId) return null;
    setRecommendations([]);
    setRecommendationError("");
    setBestMatchCourseId(null);
    setIsRecommendationsLoading(true);

    try {
      const payload = {
        roadmapId,
        phaseId: phase.id,
        goal: roadmap.goal,
        level: roadmap.level,
        topics: phase.topics || [],
        tools: phase.tools || []
      };
      const res = await recommendCoursesForPhaseApi(payload);
      if (!res?.success) {
        setRecommendationError(res?.message || "Unable to fetch recommendations.");
        return null;
      }
      setRecommendations(res.recommendations || []);
      setBestMatchCourseId(res.bestMatchCourseId || null);
      return res;
    } catch (e) {
      console.error("recommendCoursesForPhase failed", e);
      setRecommendationError("Unable to fetch course recommendations right now.");
      return null;
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const handleStartLearningPhase = async (phase) => {
    const res = await fetchRecommendations(phase);
    if (!res) {
      setIsRecommendationsOpen(true);
      return;
    }

    if (res.bestMatchCourseId) {
      setUpdatingPhaseId(phase.id);
      try {
        const startRes = await startPhaseCourseApi(roadmapId, phase.id, res.bestMatchCourseId);
        if (startRes?.success) {
          syncProgressFromServer(startRes.phasesProgress || [], startRes.currentPhaseId);
        }
        navigate(`/courses/${res.bestMatchCourseId}`);
      } catch (e) {
        console.error("startPhaseCourse failed", e);
        setRecommendationError("Unable to start the best match course right now.");
        setIsRecommendationsOpen(true);
      } finally {
        setUpdatingPhaseId(null);
      }
    } else {
      setIsRecommendationsOpen(true);
    }
  };

  const handleViewCoursesPhase = async (phase) => {
    await fetchRecommendations(phase);
    setIsRecommendationsOpen(true);
  };

  const handleMarkPhaseComplete = async (phase) => {
    if (!roadmapId || !phase) return;
    setUpdatingPhaseId(phase.id);
    try {
      const res = await markPhaseCompleteApi(roadmapId, phase.id);
      if (res?.success) {
        syncProgressFromServer(res.phasesProgress || [], res.currentPhaseId);
      }
    } catch (e) {
      console.error("markPhaseComplete failed", e);
    } finally {
      setUpdatingPhaseId(null);
    }
  };

  const handleStartCourseFromRecommendations = async (course) => {
    if (!roadmapId || !selectedPhase || !course) return;
    setUpdatingPhaseId(selectedPhase.id);
    try {
      const res = await startPhaseCourseApi(roadmapId, selectedPhase.id, course.id);
      if (res?.success) {
        syncProgressFromServer(res.phasesProgress || [], res.currentPhaseId);
        navigate(`/courses/${course.id}`);
      }
    } catch (e) {
      console.error("startPhaseCourse failed", e);
    } finally {
      setUpdatingPhaseId(null);
      setIsRecommendationsOpen(false);
    }
  };

  const handleNavigateCourse = (course) => {
    if (!course?.id) return;
    setIsRecommendationsOpen(false);
    navigate(`/courses/${course.id}`);
  };

  const toggleDrawer = (drawerName) => {
    setActiveDrawer((prev) => (prev === drawerName ? null : drawerName));
  };

  return (
    <div className="page-bg flex flex-col">
      <div className="page-shell">
        <RoadmapTopBar
          onOpenGenerate={() => toggleDrawer("generate")}
          onOpenHistory={() => toggleDrawer("history")}
        />
      </div>

      <div className="page-shell flex-1 py-6">
        <RoadmapWorkspace>
        {!roadmap && !isLoading && !error ? (
          <EmptyState onTryExample={handleTryExample} />
        ) : null}

        {isLoading ? <LoadingState /> : null}

        {!isLoading && error ? (
          <ErrorState message={error} onRetry={canGenerate ? handleGenerate : undefined} />
        ) : null}

        {!isLoading && !error && roadmap ? (
          <div className="h-full flex flex-col gap-4">
            <RoadmapHeader roadmap={roadmap} phaseProgress={phaseProgress} currentPhaseId={currentPhaseId} />

            <div className="flex-1 min-h-0 grid gap-6 grid-cols-1 lg:grid-cols-[0.85fr_1.65fr]">
              <div className="h-full card overflow-hidden">
                <PhaseNavigationList
                  phases={roadmap.phases || []}
                  selectedId={selectedPhase?.id}
                  phaseProgress={phaseProgress}
                  onSelect={setSelectedPhase}
                />
              </div>

              <div className="h-full card overflow-hidden">
                <PhaseDetailPanel
                  phase={selectedPhase}
                  status={selectedPhase ? phaseProgress?.[selectedPhase.id] || "not_started" : "not_started"}
                  isUpdating={selectedPhase ? updatingPhaseId === selectedPhase.id : false}
                  onStartLearning={() => selectedPhase && handleStartLearningPhase(selectedPhase)}
                  onViewCourses={() => selectedPhase && handleViewCoursesPhase(selectedPhase)}
                  onMarkComplete={() => selectedPhase && handleMarkPhaseComplete(selectedPhase)}
                />
              </div>
            </div>
          </div>
        ) : null}
        </RoadmapWorkspace>
      </div>

      <GenerateRoadmapDrawer
        isOpen={activeDrawer === "generate"}
        onClose={() => setActiveDrawer(null)}
        value={form}
        onChange={setForm}
        onSubmit={handleGenerate}
        isLoading={isLoading}
        error={error}
      />

      <PreviousPathsDrawer
        isOpen={activeDrawer === "history"}
        onClose={() => setActiveDrawer(null)}
        items={history}
        isLoading={isHistoryLoading}
        selectedId={roadmapId}
        onSelect={handleSelectHistory}
        onRefresh={fetchHistory}
      />

      <RecommendedCoursesDrawer
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
        phase={selectedPhase}
        recommendations={recommendations}
        bestMatchCourseId={bestMatchCourseId}
        isLoading={isRecommendationsLoading}
        error={recommendationError}
        onStartCourse={handleStartCourseFromRecommendations}
        onNavigateCourse={handleNavigateCourse}
      />
    </div>
  );
};

export default AiLearningPathPage;


