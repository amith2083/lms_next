import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { IQuizset } from "../interfaces/IQuizset";
import { toast } from "sonner";

// Query key constants
const QUIZSET_KEY = ["quizsets"];

// Type for quiz data input (matches quizSchema in API routes)
interface QuizInput {
  title: string;
  description?: string;
  optionA: { label: string; isTrue: boolean };
  optionB: { label: string; isTrue: boolean };
  optionC: { label: string; isTrue: boolean };
  optionD: { label: string; isTrue: boolean };
  mark?: number;
  explanations?: string;
}

// Type for quiz set creation/update input
interface QuizsetInput {
  title: string;
  description?: string;
  active?: boolean;
}

// Hook to fetch all quiz sets
export const useGetQuizsets = (excludeUnpublished: boolean = false) => {
  return useQuery({
    queryKey: [...QUIZSET_KEY, { excludeUnpublished }],
    queryFn: async () => {
      const res = await axios.get<IQuizset[]>("/quizsets", {
        params: { excludeUnpublished },
      });
      return res.data;
    },
  });
};

// Hook to fetch a single quiz set by ID
export const useQuizsetDetails = (quizsetId: string) => {
  console.log("idhook", quizsetId);
  return useQuery({
    queryKey: ["quizsetDetails", quizsetId],
    queryFn: async () => {
      console.log("QueryFn running");
      const { data } = await axios.get<IQuizset>(`/quizsets/${quizsetId}`);
      console.log("Quizset API Response:", data);
      return data;
    },
    enabled: !!quizsetId,
  });
};

// Hook to create a quiz set
export const useCreateQuizset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: QuizsetInput) => {
      console.log("data", data);
      const res = await axios.post<IQuizset>("/quizsets", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZSET_KEY });
    },
    onError: (error) => {
      console.error("Failed to create quizset:", error);
    },
  });
};

// Hook to update a quiz set
export const useUpdateQuizset = (quizsetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: Partial<QuizsetInput> }) => {
      const res = await axios.put<IQuizset>(`/quizsets/${quizsetId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizsetDetails", quizsetId],
      });
      queryClient.invalidateQueries({ queryKey: QUIZSET_KEY });
    },
    onError: (error) => {
      console.error("Failed to update quizset:", error);
    },
  });
};

// Hook to delete a quiz set
export const useDeleteQuizset = (quizsetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/quizsets/${quizsetId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizsetDetails", quizsetId],
      });
      queryClient.invalidateQueries({ queryKey: QUIZSET_KEY });
    },
    onError: (error) => {
      console.error("Failed to delete quizset:", error);
    },
  });
};

// Hook to toggle quiz set publish state
export const useToggleQuizsetStatus = (quizsetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch<{ active: boolean }>(
        `/quizsets/${quizsetId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizsetDetails", quizsetId],
      });
      queryClient.invalidateQueries({ queryKey: QUIZSET_KEY });
    },
    onError: (error) => {
      console.error("Failed to toggle quizset status:", error);
    },
  });
};

// Hook to add a quiz to a quiz set
export const useAddQuizToQuizset = (quizsetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizData: QuizInput) => {
      const res = await axios.post(`/quizsets/${quizsetId}`, quizData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizsetDetails", quizsetId],
      });
    },
    onError: (error: any) => {
      console.error("Failed to add quiz to quizset:", error);
      toast.error(error?.response?.data?.message || "Failed to add quiz");
    },
  });
};

// Hook to delete a quiz from a quiz set
export const useDeleteQuizFromQuizset = (quizsetId: string, quizId: string) => {
  console.log("ids===", quizsetId, quizId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/quizsets/${quizsetId}/quizzes/${quizId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizsetDetails", quizsetId],
      });
    },
    onError: (error) => {
      console.error("Failed to delete quiz from quizset:", error);
    },
  });
};
