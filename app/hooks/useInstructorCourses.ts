import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios"; // your custom instance

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructorCourses"],
    queryFn: async () => {
      const { data } = await axios.get("/instructor/courses");
      return data;
    },
  });
};
