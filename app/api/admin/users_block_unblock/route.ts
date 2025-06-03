import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/model/user";

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
  await dbConnect();
  const body = await request.json();
  const { userId, block } = body;
  console.log('userid & block ',userId,block)

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: block },
      { new: true }
    );
console.log('0000000000000000000',updatedUser)
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user status" },
      { status: 500 }
    );
  }
};
