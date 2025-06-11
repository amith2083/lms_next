import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios"; 

export const useLesson= (lessonId: string) => {
  return useQuery({
    queryKey: ["Lesson",lessonId],
    queryFn: async () => {
      const { data } = await axios.get(`/instructor/lessons/${lessonId}`);
      return data;
    },
    enabled: !!lessonId, // Only run if moduleId exists
  });
};
