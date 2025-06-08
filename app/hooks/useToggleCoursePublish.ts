// app/hooks/useToggleCoursePublish.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useToggleCoursePublish = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/instructor/courses/${courseId}`, {
        action: "toggle-publish",
      });
      return res.data.status;
    },

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });

      const previous = queryClient.getQueryData(["courseDetails", courseId]);

      queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
        ...old,
        status: !old.status,
      }));

      return { previous };
    },

    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["courseDetails", courseId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};
