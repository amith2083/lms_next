import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";

import { User } from "@/model/user";
import { getUsers } from "@/queries/users";


// app/api/user/route.ts


export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await dbConnect();
  const { email } = await request.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
};


  export const GET= async (request: NextRequest): Promise<NextResponse> => {
    
   
  
    await dbConnect();
  
  
    try {
        const users = await getUsers()
        
        return NextResponse.json(users, { status: 200 });
    
     
    } catch (error: any) {
      console.log(error)
      return NextResponse.json(
        { message: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }
 

