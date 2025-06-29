// app/hooks/useCourses.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// ---------------------- Types ----------------------

interface CourseData {
  title: string;
  description: string;
}

type UpdateCourseData = Partial<{
  title: string;
  description: string;
  price: number;
}>;

// ---------------------- Queries ----------------------

// Fetch all instructor courses
export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructorCourses"],
    queryFn: async () => {
      const { data } = await axios.get("/courses");
      return data;
    },
  });
};

// Fetch course details
export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/courses/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });
};

//fetch related courses
export const useRelatedCourses = (courseId: string, categoryId: string) => {
  return useQuery({
    queryKey: ["relatedCourses", courseId, categoryId],
    queryFn: async () => {
      const { data } = await axios.get(`/courses/${courseId}/relatedCourse/${categoryId}`);
      return data;
    },
    enabled: !!courseId && !!categoryId,
  });
};

// ---------------------- Mutations ----------------------

// Create a course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CourseData) => {
      const response = await axios.post("/courses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
};

// Update a course
export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCourseData) => {
      const response = await axios.patch(`/courses/${courseId}`, data);
      return response.data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });

      const previous = queryClient.getQueryData(["courseDetails", courseId]);

      queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
        ...old,
        ...newData,
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

// Update course image
export const useUpdateCourseImage = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/upload", formData);
      return response.data;
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

// Toggle course publish status
export const useToggleCoursePublish = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/courses/${courseId}`, {
        action: "toggle-publish",
      });
      return res.data.status;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["courseDetails", courseId] });

      const previous = queryClient.getQueryData(["courseDetails", courseId]);

      queryClient.setQueryData(["courseDetails", courseId], (old: any) => ({
        ...old,
        status: !old.status,
      }));

      return { previous };
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["courseDetails", courseId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
    },
  });
};

// Delete course
export const useDeleteCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
  });
};
