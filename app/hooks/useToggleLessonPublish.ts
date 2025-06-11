

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useToggleLessonPublish = (lessonId: string) => {
  const queryClient = useQueryClient();
   console.log('lessonId',lessonId)
  return useMutation({
    mutationFn: async () => {
     console.log('working')
      const res = await axios.patch(`/instructor/lessons/${lessonId}`, {
        action: "toggle-publish",
      });
     
      return res.data.active;
    },

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["Lesson", lessonId] });

      const previous = queryClient.getQueryData(["Lesson", lessonId]);

      queryClient.setQueryData(["Lesson", lessonId], (old: any) => ({
        ...old,
        active: !old.active,
      }));

      return { previous };
    },

    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["Lesson", lessonId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Lesson", lessonId] });
    },
  });
};
