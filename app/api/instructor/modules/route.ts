import { createModule } from "@/service/moduleService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
     console.log("POST", body)
    const module = await createModule(body);
    return NextResponse.json(module, { status: 201 });
  } catch (error: any) {
     console.error(error);
    return NextResponse.json(
      { message: error.message || "Failed to create module" },
      { status: 500 }
    );
  }
}