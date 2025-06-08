import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";
import { getCourseDetailsByInstructor } from "@/queries/courses";
import { createCourse } from "@/service/courseService";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
     console.log("POST /instructor/courses received body:", body);
    const course = await createCourse(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
     console.error("Error in POST /instructor/courses:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}

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
