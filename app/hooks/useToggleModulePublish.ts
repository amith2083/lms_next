// app/hooks/useToggleCoursePublish.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useToggleModulePublish = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/instructor/modules/${moduleId}`, {
        action: "toggle-publish",
      });
      return res.data.status;
    },

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["Module", moduleId] });

      const previous = queryClient.getQueryData(["Module", moduleId]);

      queryClient.setQueryData(["Module", moduleId], (old: any) => ({
        ...old,
        status: !old.status,
      }));

      return { previous };
    },

    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["Module", moduleId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Module", moduleId] });
    },
  });
};
