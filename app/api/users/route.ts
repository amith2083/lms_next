import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";

import { User } from "@/model/user";
import { getUsers } from "@/queries/users";





  export const GET= async (request: NextRequest): Promise<NextResponse> => {
    
   
  
    await dbConnect();
  
  
    try {
        const users = await getUsers()
        console.log(users)
        return NextResponse.json(users, { status: 200 });
    
     
    } catch (error: any) {
      console.log(error)
      return NextResponse.json(
        { message: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }
 

