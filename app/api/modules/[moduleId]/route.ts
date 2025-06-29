import { ModuleRepository } from "@/app/respositories/ModuleRespository";
import { ModuleService } from "@/service/moduleService";
import { NextRequest, NextResponse } from "next/server";

const moduleRepository = new ModuleRepository();
const moduleService = new ModuleService(moduleRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const module = await moduleService.getModule(params.moduleId);
    return NextResponse.json(module, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /modules/[moduleId]:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch module" },
      { status: error.message === "Module not found" ? 404 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const body = await req.json();
    console.log("PATCH /modules/[moduleId] body:", body);

    if (body.action === "toggle-publish") {
      const updatedStatus = await moduleService.changeModulePublishState(params.moduleId);
      return NextResponse.json({ status: updatedStatus });
    }

    const updatedModule = await moduleService.updateModule(params.moduleId, body);
    return NextResponse.json(updatedModule);
  } catch (error: any) {
    console.error("Error in PATCH /modules/[moduleId]:", error);
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

    await moduleService.deleteModule(params.moduleId, courseId);
    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /modules/[moduleId]:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}