import { NextResponse } from "next/server";
import { User } from "@/model/user";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Missing email or role" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
