import { getCourseProgressApi, markModuleCompleteApi } from "@/Api/progress.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCourseProgress = (courseId, enabled = true) => {
    return useQuery({
        queryFn: () => getCourseProgressApi(courseId),
        queryKey: ["courseProgress", courseId],
        enabled: !!courseId && enabled
    });
};

export const useMarkModuleComplete = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markModuleCompleteApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["courseProgress", courseId]);
        }
    });
};
