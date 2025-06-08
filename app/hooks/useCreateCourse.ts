import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface CourseData {
  title: string;
  description: string;
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CourseData) => {
           console.log("Calling API to create course with:", data);
      const response = await axios.post("/instructor/courses", data);
      return response.data;
    },
    onSuccess: () => {
        console.log("Invalidating courseDetails cache");
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
};
