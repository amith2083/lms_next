
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

type UpdateLessonData = Partial<{
  title: string;
  slug: string;
  description:string;
  access:string;
  video_url:string;
  duration:number;
 
 
}>;
export const useUpdateLesson= (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:UpdateLessonData) => {
        console.log("Submitting title:", data);
     
      const response = await axios.patch(`/instructor/lessons/${lessonId}`, data);
      console.log('res',response)
      return response.data;
    },

    onMutate: async (newData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["Lesson", lessonId] });

      // Snapshot previous data
      const previous = queryClient.getQueryData(["Lesson", lessonId]);

      // Optimistically update cache
      queryClient.setQueryData(["Lesson", lessonId], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },

    onError: (_err, _newData, context) => {
      // Rollback cache to previous state
      if (context?.previous) {
        queryClient.setQueryData(["Lesson", lessonId], context.previous);
      }
    },

    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["Lesson", lessonId] });
    },
  });
};

