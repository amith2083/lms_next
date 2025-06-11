
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

type UpdateModuleData = Partial<{
  title: string;
  slug: string;
 
 
}>;
export const useUpdateModule= (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:UpdateModuleData) => {
        console.log("Submitting title:", data);
     
      const response = await axios.patch(`/instructor/modules/${moduleId}`, data);
      console.log('res',response)
      return response.data;
    },

    onMutate: async (newData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["Module", moduleId] });

      // Snapshot previous data
      const previous = queryClient.getQueryData(["Module", moduleId]);

      // Optimistically update cache
      queryClient.setQueryData(["Module", moduleId], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },

    onError: (_err, _newData, context) => {
      // Rollback cache to previous state
      if (context?.previous) {
        queryClient.setQueryData(["Module", moduleId], context.previous);
      }
    },

    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["Module", moduleId] });
    },
  });
};

