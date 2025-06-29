// // lib/store/authStore.ts
// 'use client';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { v4 as uuidv4 } from 'uuid';

// interface AuthState {
//     sessionId: string;
//   user: { email: string; role: string; name?: string } | null;
//   otpEmail: string | null;
//   error: string | null;
//   isLoading: boolean;
//   setUser: (user: { email: string; role: string; name?: string } | null) => void;
//   setOtpEmail: (email: string | null) => void;
//   setError: (error: string | null) => void;
//   setLoading: (isLoading: boolean) => void;
//   clearAuth: () => void;
// }   

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//         sessionId: uuidv4(),
//       user: null,
//       otpEmail: null,
//       error: null,
//       isLoading: false,
//       setUser: (user) => set({ user }),
//       setOtpEmail: (email) => set({ otpEmail: email }),
//       setError: (error) => set({ error }),
//       setLoading: (isLoading) => set({ isLoading }),
//       clearAuth: () => set({sessionId: uuidv4(), user: null, otpEmail: null, error: null, isLoading: false }),
//     }),
//     {
//       name: 'auth-storage', // Persist to localStorage
//       partialize: (state) => ({ otpEmail: state.otpEmail, user: state.user,sessionId: state.sessionId }), // Persist only otpEmail and user
//     }
//   )
// );