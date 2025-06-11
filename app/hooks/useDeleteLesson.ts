import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";


export const useDeleteLesson = (lessonId: string,moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/instructor/lessons/${lessonId}`,{ params: { moduleId }});
    },
    onSuccess: () => {
      
    queryClient.invalidateQueries({ queryKey: ["Lesson", lessonId] });
    },
  });
};
