import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // assumes you have a configured axios instance
import { IUser } from "../interfaces/IUser";

export const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
    retry: false, // optional: don't retry on 401
  });
};

export const useUpdateUser= (userId: string)=> {
    console.log('userid',userId)
  const queryClient = useQueryClient();
    return useMutation({
    mutationFn: async ({ data }: { data: Partial<IUser> }) => {
        console.log('data',data)
       
      const res = await axios.put<IUser>(`/users/${userId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loggedInUser"],
      });
      
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
}
//   return useMutation({
//     mutationFn: (data: Partial<IUser>) => await axios.put(userId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['user', userId] });
//     },
//   });
