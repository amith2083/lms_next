import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios"; 

export const useModule= (moduleId: string) => {
  return useQuery({
    queryKey: ["Module",moduleId],
    queryFn: async () => {
      const { data } = await axios.get(`/instructor/modules/${moduleId}`);
      return data;
    },
    enabled: !!moduleId, // Only run if moduleId exists
  });
};
