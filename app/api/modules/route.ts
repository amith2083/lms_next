import { ModuleRepository } from "@/app/respositories/ModuleRespository";
import { ModuleService } from "@/service/moduleService";
import { NextRequest, NextResponse } from "next/server";

const moduleRepository = new ModuleRepository();
const moduleService = new ModuleService(moduleRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("POST /modules received body:", body);
    const module = await moduleService.createModule(body);
    return NextResponse.json(module, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /modules:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create module" },
      { status: 500 }
    );
  }
}