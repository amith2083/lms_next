import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/instructor/courses/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};
