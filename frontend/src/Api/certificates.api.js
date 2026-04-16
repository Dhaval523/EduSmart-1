import axios from "axios";

export const getCertificateApi = async (courseId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/certificates/${courseId}`,
    { withCredentials: true }
  );
  return res.data;
};

