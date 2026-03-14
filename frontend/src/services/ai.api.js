import axios from "axios";

/**
 * Note: this file stays as JS to avoid forcing a repo-wide TS migration.
 * Types are defined in `src/types/roadmap.ts` and consumed by TSX components.
 */

export const generateLearningPathApi = async (payload) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/ai/generate-learning-path`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  );

  return res.data;
};

export const getLearningPathsApi = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/ai/learning-paths`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  });

  return res.data;
};

export const recommendCoursesForPhaseApi = async (payload) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/roadmap/recommend-courses`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  );

  return res.data;
};

export const markPhaseCompleteApi = async (roadmapId, phaseId) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/roadmap/${roadmapId}/phases/${phaseId}/complete`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  );
  return res.data;
};

export const startPhaseCourseApi = async (roadmapId, phaseId, courseId) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/roadmap/${roadmapId}/phases/${phaseId}/start-course`,
    { courseId },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  );
  return res.data;
};
