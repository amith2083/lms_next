
import { NextRequest, NextResponse } from "next/server";

import { getCourseDetails } from "@/queries/courses";
import { changeCoursePublishState, deleteCourse, updateCourse } from "@/service/courseService";

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
   

    if (body.action === "toggle-publish") {
      const updatedStatus = await changeCoursePublishState(params.courseId);
      return NextResponse.json({ status: updatedStatus });
    }
    const updatedCourse = await updateCourse(params.courseId, body);
   

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await deleteCourse(params.courseId);
    return NextResponse.json({ message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}