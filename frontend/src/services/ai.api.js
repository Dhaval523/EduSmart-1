import axios from "axios";

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
