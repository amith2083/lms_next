// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// export const useUpdateCourse = (courseId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: { title: string }) => {
//         console.log('data',data)
//       const response = await axios.patch(`/instructor/courses/${courseId}`, data);
      
//       return response.data;
//     },
//     onMutate: async (newData) => {
//       await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });
//       const previous = queryClient.getQueryData(["courseDetails", courseId]);

//       queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
//         ...old,
//         ...newData,
//       }));

//       return { previous };
//     },
//     onError: (err, newData, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(["courseDetails", courseId], context.previous);
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
//     },
//   });
// };
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string }) => {
      const response = await axios.patch(`/api/instructor/courses/${courseId}`, data);
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

