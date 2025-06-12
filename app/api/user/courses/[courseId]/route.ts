import { NextRequest, NextResponse } from "next/server";
import { getCourseDetails } from "@/queries/courses";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
   

    const course = await getCourseDetails(params.id);

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
