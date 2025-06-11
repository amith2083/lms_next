
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
type UpdateCourseData = Partial<{
  title: string;
  description: string;
  price: number;
 
}>;
export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:UpdateCourseData) => {
     
      const response = await axios.patch(`/instructor/courses/${courseId}`, data);
      return response.data;
    },

    onMutate: async (newData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });

      // Snapshot previous data
      const previous = queryClient.getQueryData(["courseDetails", courseId]);

      // Optimistically update cache
      queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },

    onError: (_err, _newData, context) => {
      // Rollback cache to previous state
      if (context?.previous) {
        queryClient.setQueryData(["courseDetails", courseId], context.previous);
      }
    },

    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};

