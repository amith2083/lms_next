import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";


export const useDeleteCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/instructor/courses/${courseId}`);
    },
    onSuccess: () => {
      // Remove course from cache or list
    queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};
