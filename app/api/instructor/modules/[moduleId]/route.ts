import { NextRequest, NextResponse } from "next/server";
import { getModule } from "@/queries/modules";
import { changemodulePublishState, deleteModule, updateModule } from "@/service/moduleService";

export async function GET(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const module = await getModule(params.moduleId);
   
    if (!module) {
      return NextResponse.json(
        { message: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(module, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Failed to fetch module", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const body = await req.json();
    console.log('body',body)
   
   

    if (body.action === "toggle-publish") {
        
      const updatedStatus = await changemodulePublishState(params.moduleId);
      console.log('updatedstatus',updatedStatus)
      return NextResponse.json({ status: updatedStatus });
    }
    const updatedModule = await updateModule(params.moduleId, body);
   

    return NextResponse.json(updatedModule);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const courseId = req.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ message: "courseId is required" }, { status: 400 });
    }

    await deleteModule(params.moduleId, courseId);
    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}