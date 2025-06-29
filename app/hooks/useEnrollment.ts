import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { DocumentWithId } from '@/lib/convertData';

interface EnrollmentData {
  courseId: string;
  userId: string;
  paymentMethod: string;
}

// Fetch enrollments for a course
export const useEnrollmentsForCourse = (courseId: string) => {
  return useQuery<DocumentWithId[], Error>({
    queryKey: ['enrollmentcourses', courseId],
    queryFn: async () => {
      const response = await axios.get(`/enrollments/course/${courseId}`);
      
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Fetch enrollments for a user
export const useEnrollmentsForUser = (userId: string) => {
  
  return useQuery<DocumentWithId[], Error>({
    queryKey: ['enrollmentusers', userId],
    queryFn: async () => {
       
      const response = await axios.get(`/enrollments/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// Enroll in a course
export const useEnrollForCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentWithId, Error, EnrollmentData>({
    mutationFn: async ({ courseId, userId, paymentMethod }) => {
      const response = await axios.post(`/enrollments/user/${userId}`, { courseId, paymentMethod });
      return response.data;
    },
    onSuccess: (_, { userId, courseId }) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', courseId] });
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
    },
  });
};

// Fetch current user's enrollments
export const useCurrentUserEnrollments = () => {
  return useQuery<DocumentWithId[], Error>({
    queryKey: ['enrollments', 'current'],
    queryFn: async () => {
      const response = await axios.get('/enrollments');
      return response.data;
    },
  });
};