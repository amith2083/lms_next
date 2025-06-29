import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Category } from "@/model/category";

// const CATEGORY_KEY = ["categories"];

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get("/categories");
      return res.data;
    },
    refetchOnWindowFocus:false,
       refetchOnMount:false,
  });
  
};

export const useCategoryDetails = (categoryId: string) => {
  return useQuery({
    queryKey: ["CategoryDetails", categoryId],
    queryFn: async () => {
      const { data } = await axios.get(`/categories/${categoryId}`);
      console.log("API Response:", data);
      return data;
    },
    enabled: !!categoryId,
  });
};
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await axios.post("/categories", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: Partial<{ title: string; description?: string }>;
    }) => {
      const res = await axios.put(`/categories/${categoryId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CategoryDetails", categoryId],
      });
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
    },
  });
};

export const useDeleteCategory = (categoryId:string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/categories/${categoryId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryDetails", categoryId] });
    },
  });
};

export const useToggleCategoryStatus = (categoryId:string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/categories/${categoryId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoryDetails", categoryId] });
    },
  });
};
