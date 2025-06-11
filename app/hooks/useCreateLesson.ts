import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface LessonData {
  title: string;
  moduleId: string;
  slug: string;
  order: number;
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:LessonData) => {
         
      const response = await axios.post("/instructor/lessons", data);
      return response.data;
    },
    onSuccess: () => {
        
      queryClient.invalidateQueries({ queryKey: ["module"] });
    },
  });
};








