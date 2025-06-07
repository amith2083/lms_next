import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/instructor/categories");
      return data;
    },
  });
};
