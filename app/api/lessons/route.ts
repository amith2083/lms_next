import { LessonRepository } from "@/app/respositories/LessonRepository";
import { LessonService } from "@/service/lessonService";
import { NextRequest, NextResponse } from "next/server";


const lessonRepository = new LessonRepository();
const lessonService = new LessonService(lessonRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("POST /lessons received body:", body);
    const { moduleId, ...lessonData } = body;
    if (!moduleId) {
      return NextResponse.json({ message: "moduleId is required" }, { status: 400 });
    }
    const lesson = await lessonService.createLesson(lessonData, moduleId);
    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /lessons:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create lesson" },
      { status: 500 }
    );
  }
}