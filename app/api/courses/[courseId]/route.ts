import { CourseRepository } from "@/app/respositories/CourseRepository";
import { CourseService } from "@/service/CourseService";
import { NextRequest, NextResponse } from "next/server";


const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await courseService.getCourseDetails(params.courseId);
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const body = await req.json();
    
    console.log("PATCH /courses body:", body);

    if (body.action === "toggle-publish") {
      const updatedStatus = await courseService.changeCoursePublishState(params.courseId);
      return NextResponse.json({ status: updatedStatus });
    }
     // Action: update quiz set
    if (body.action === "update-quizset" && body.quizSetId) {
      await courseService.updateQuizSetForCourse(params.courseId, body.quizSetId);
      return NextResponse.json({ message: "Quiz set updated successfully" });
    }

    const updatedCourse = await courseService.updateCourse(params.courseId, body);
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
    await courseService.deleteCourse(params.courseId);
    return NextResponse.json({ message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}