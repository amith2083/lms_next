import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";
import { getCourseDetailsByInstructor } from "@/queries/courses";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const instructor = await getUserByEmail(session.user.email);
    if (!instructor?.id) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    const data = await getCourseDetailsByInstructor(instructor.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch instructor courses" },
      { status: 500 }
    );
  }
}
