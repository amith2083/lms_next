import { replaceMongoIdInObject } from "@/lib/convertData";
import { User } from "@/model/user";
import { Types } from "mongoose";

import bcrypt from "bcryptjs";




export const getUsers= async () => {
  const users = await User.find()
   
  return users;
};


  
export const getUserDetails= async(userId: Types.ObjectId):Promise<any>=>{
    const user = await User.findById(userId).lean();
    return replaceMongoIdInObject(user);
} 


export const getUserByEmail=async(email:string)=>{
    const user = await User.findOne({email: email}).lean();
    console.log('getemail',user)
    return replaceMongoIdInObject(user);
} 