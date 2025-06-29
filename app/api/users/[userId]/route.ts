import { NextRequest, NextResponse } from "next/server";

import { UserService } from "@/service/UserService";
import { UserRepository } from "@/app/respositories/UserRepository";
import { dbConnect } from "@/service/mongo";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const data = await req.json();

    const updatedUser = await userService.updateUser(userId, data);

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
