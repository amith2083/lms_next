// app/hooks/useModules.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface ModuleData {
  title: string;
  courseId: string;
  slug: string;
  order: number;
}

type UpdateModuleData = Partial<{
  title: string;
  slug: string;
}>;

// Create a new module
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ModuleData) => {
      const response = await axios.post("/modules", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails"] });
    },
  });
};

// Get module details-------------------------------------------------------------------------------------------------------------
export const useGetModule = (moduleId: string) => {
  return useQuery({
    queryKey: ["Module", moduleId],
    queryFn: async () => {
      const { data } = await axios.get(`/modules/${moduleId}`);
      return data;
    },
    enabled: !!moduleId,
  });
};

// Update module-----------------------------------------------------------------------------------------------------------------------
export const useUpdateModule = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateModuleData) => {
      const response = await axios.patch(
        `/modules/${moduleId}`,
        data
      );
      return response.data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["Module", moduleId] });

      const previous = queryClient.getQueryData(["Module", moduleId]);

      queryClient.setQueryData(["Module", moduleId], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["Module", moduleId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Module", moduleId] });
    },
  });
};

// Toggle publish status----------------------------------------------------------------------------------------------------------------
export const useToggleModulePublish = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/modules/${moduleId}`, {
        action: "toggle-publish",
      });
      return res.data.status;
    },
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

// Delete a module------------------------------------------------------------------------------------------------------------------------
export const useDeleteModule = (moduleId: string, courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/modules/${moduleId}`, {
        params: { courseId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};
