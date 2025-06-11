import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";


export const useDeleteModule = (moduleId: string,courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/instructor/modules/${moduleId}`,{ params: { courseId }});
    },
    onSuccess: () => {
      
    queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};
