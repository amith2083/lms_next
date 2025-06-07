
import { NextRequest, NextResponse } from "next/server";

import { getCourseDetails } from "@/queries/courses";
import { updateCourse } from "@/service/courseService";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await getCourseDetails(params.courseId);
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const body = await req.json();
    console.log('body',body)

    const updatedCourse = await updateCourse(params.courseId, body);
    console.log('updated',updateCourse)

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}