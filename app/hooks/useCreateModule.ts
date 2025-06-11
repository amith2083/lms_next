import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface ModuleData {
  title: string;
  courseId: string;
  slug: string;
  order: number;
}

export const useCreateMOdule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ModuleData) => {
         
      const response = await axios.post("/instructor/modules", data);
      return response.data;
    },
    onSuccess: () => {
        
      queryClient.invalidateQueries({ queryKey: ["courseDetails"] });
    },
  });
};




