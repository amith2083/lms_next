import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // or "axios" if using default

export const useUpdateCourseImage = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/upload", formData);
      return response.data; // e.g., { imageUrl: "/assets/images/courses/..." }
    },

    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });

      const previous = queryClient.getQueryData(["courseDetails", courseId]);

      const file = formData.get("files") as File;
      const fakeImageUrl = `/assets/images/courses/${file?.name || "temp.jpg"}`;

      queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
        ...old,
        imageUrl: fakeImageUrl,
      }));

      return { previous };
    },

    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["courseDetails", courseId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};
