import axios from "axios";

export const markModuleCompleteApi = async (payload) => {
    const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/progress/complete`,
        payload,
        {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }
    );

    return res.data;
};

export const getCourseProgressApi = async (courseId) => {
    const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/progress/course/${courseId}`,
        {
            withCredentials: true
        }
    );

    return res.data;
};
