'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import {  getCourses, getCourseDetails, getCourseDetailsByInstructor } from '@/queries/courses';
import { createCourse, update } from '@/app/actions/course';
// import { CourseData } from '@/types/course'; // Adjust the import based on your actual CourseData type

interface Course {
  id: string;
  title: string;
  subtitle:string,
  description: string;
  role?: string;
  category?: string;
  status?: boolean;
  isApproved?: boolean;
  thumbnail?: string;
  price?: number;
  modules?: any[];
  testimonials?: any[];
  // Add other fields as per your Course model
}

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  setCourses: (courses: Course[]) => void;
  setSelectedCourse: (course: Course | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCourses: () => Promise<void>;
  fetchCourseDetails: (courseId: string) => Promise<void>;
  fetchCoursesByInstructor: () => Promise<void>;
  createNewCourse: (data) => Promise<void>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<void>;
  clearCourseState: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      selectedCourse: null,
      isLoading: false,
      error: null,

      // Setters
      setCourses: (courses) => set({ courses }),
      setSelectedCourse: (selectedCourse) => set({ selectedCourse }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Fetch all courses
      fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          const courses = await getCourses();
          set({ courses, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch courses', isLoading: false });
          toast.error(error.message || 'Failed to fetch courses');
        }
      },

      // Fetch course details by ID
      fetchCourseDetails: async (courseId: string) => {
        set({ isLoading: true, error: null });
        try {
          const course = await getCourseDetails(courseId);
          set({ selectedCourse: course || null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch course details', isLoading: false });
          toast.error(error.message || 'Failed to fetch course details');
        }
      },

      // Fetch courses by instructor
      fetchCoursesByInstructor: async () => {
        set({ isLoading: true, error: null });
        try {
          const courses = await getCourseDetailsByInstructor();
          set({ courses, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch instructor courses', isLoading: false });
          toast.error(error.message || 'Failed to fetch instructor courses');
        }
      },

      // Create a new course
      createNewCourse: async (data: CourseData) => {
        set({ isLoading: true, error: null });
        try {
          const course = await createCourse(data);
          set((state) => ({
            courses: [...state.courses, course],
            isLoading: false,
          }));
          toast.success('Course created successfully');
        } catch (error: any) {
          set({ error: error.message || 'Failed to create course', isLoading: false });
          toast.error(error.message || 'Failed to create course');
        }
      },


      updateCourse: async (courseId: string, data: Partial<Course>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCourse = await update(courseId, data);
          set((state) => ({
            courses: state.courses.map((course) =>
              course.id === courseId ? { ...course, ...data } : course
            ),
            selectedCourse:
              state.selectedCourse?.id === courseId
                ? { ...state.selectedCourse, ...data }
                : state.selectedCourse,
            isLoading: false,
          }));
          toast.success('Course updated successfully');
        } catch (error: any) {
          set({ error: error.message || 'Failed to update course', isLoading: false });
          toast.error(error.message || 'Failed to update course');
        }
      },

      // Clear course state
      clearCourseState: () =>
        set({ courses: [], selectedCourse: null, isLoading: false, error: null }),
    }),
    {
      name: 'course-storage', // Persist to localStorage
      partialize: (state) => ({
        courses: state.courses,
        selectedCourse: state.selectedCourse,
      }), // Persist only courses and selectedCourse
    }
  )
);