// hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useListCourses = (page: number, limit: number = 3) => {
  return useQuery({
    queryKey: ['courses', page],
    queryFn: async () => {
      const res = await axios.get(`/api/user/courses?page=${page}&limit=${limit}`);
      return res.data; // { courses: [], total, totalPages }
    },
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    keepPreviousData: true,
  });
};
