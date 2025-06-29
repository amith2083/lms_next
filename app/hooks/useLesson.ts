

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// ---------------------- Types ----------------------

interface LessonData {
  title: string;
  moduleId: string;
  slug: string;
  order: number;
}

type UpdateLessonData = Partial<{
  title: string;
  slug: string;
  description: string;
  access: string;
  video_url: string;
  duration: number;
}>;

// ---------------------- Queries ----------------------

// Get single lesson details-----------------------------------------------------------------------------------------------------------
export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ["Lesson", lessonId],
    queryFn: async () => {
      const { data } = await axios.get(`/lessons/${lessonId}`);
      return data;
    },
    enabled: !!lessonId,
  });
};

// ---------------------- Mutations ----------------------

// Create lesson---------------------------------------------------------------------------------------------------------------------
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LessonData) => {
      const response = await axios.post("/lessons", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module"] }); // Consider using ["module", moduleId] for more precision
    },
  });
};

// Update lesson----------------------------------------------------------------------------------------------------------------------
export const useUpdateLesson = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLessonData) => {
      const response = await axios.patch(`/lessons/${lessonId}`, data);
      return response.data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["Lesson", lessonId] });
      const previous = queryClient.getQueryData(["Lesson", lessonId]);

      queryClient.setQueryData(["Lesson", lessonId], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["Lesson", lessonId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Lesson", lessonId] });
    },
  });
};

// Toggle publish/unpublish------------------------------------------------------------------------------------------------------------
export const useToggleLessonPublish = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/lessons/${lessonId}`, {
        action: "toggle-publish",
      });
      return res.data.active;
    },
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

// Delete lesson------------------------------------------------------------------------------------------------------------------------
export const useDeleteLesson = (lessonId: string, moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/lessons/${lessonId}`, {
        params: { moduleId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lesson", lessonId] });
    },
  });
};
