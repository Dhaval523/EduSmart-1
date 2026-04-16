import { getCertificateApi } from "@/Api/certificates.api";
import { useQuery } from "@tanstack/react-query";

export const useGetCertificate = (courseId, enabled = true) => {
  return useQuery({
    queryFn: () => getCertificateApi(courseId),
    queryKey: ["certificate", courseId],
    enabled: !!courseId && enabled,
    retry: false
  });
};

