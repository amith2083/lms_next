import { User } from "@/model/user";




export const getUsers= async () => {
  const users = await User.find()
   
  return users;
};
