import { LessonRepository } from "@/app/respositories/LessonRepository";
import { LessonService } from "@/service/lessonService";
import { NextRequest, NextResponse } from "next/server";


const lessonRepository = new LessonRepository();
const lessonService = new LessonService(lessonRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lesson = await lessonService.getLesson(params.lessonId);
    return NextResponse.json(lesson, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /lessons/[lessonId]:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch lesson" },
      { status: error.message === "Lesson not found" ? 404 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const body = await req.json();
    console.log("PATCH /lessons/[lessonId] body:", body);

    if (body.action === "toggle-publish") {
      const updatedStatus = await lessonService.changeLessonPublishState(params.lessonId);
      return NextResponse.json({ active: updatedStatus });
    }

    const updatedLesson = await lessonService.updateLesson(params.lessonId, body);
    return NextResponse.json(updatedLesson);
  } catch (error: any) {
    console.error("Error in PATCH /lessons/[lessonId]:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const moduleId = req.nextUrl.searchParams.get("moduleId");
    if (!moduleId) {
      return NextResponse.json({ message: "moduleId is required" }, { status: 400 });
    }

    await lessonService.deleteLesson(params.lessonId, moduleId);
    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /lessons/[lessonId]:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}