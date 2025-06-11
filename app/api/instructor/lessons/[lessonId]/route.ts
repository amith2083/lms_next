import { getLesson } from "@/queries/lesson";
import { changeLessonPublishState, deleteLesson, updateLesson } from "@/service/lessonService";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lesson = await getLesson(params.lessonId);
   
    if (!lesson) {
      return NextResponse.json(
        { message: "lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Failed to fetch lesson", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    console.log('patchreq',params.lessonId)
    const body = await req.json();
    console.log('body',body)
   
   

    if (body.action === "toggle-publish") {
        
      const updatedStatus = await changeLessonPublishState(params.lessonId);
      console.log('updatedstatus',updatedStatus)
      return NextResponse.json({ active: updatedStatus });
    }
    const updatedLesson = await updateLesson(params.lessonId, body);
   

    return NextResponse.json(updatedLesson);
  } catch (error: any) {
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

    await deleteLesson(params.lessonId, moduleId);
    return NextResponse.json({ message: "lesson deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}