import { QuizsetRepository } from "@/app/respositories/QuizsetRepository";
import { QuizsetService } from "@/service/QuizsetService";
import { NextRequest, NextResponse } from "next/server";

const quizsetRepository = new QuizsetRepository();
const quizsetService = new QuizsetService(quizsetRepository);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const excludeUnpublished = searchParams.get("excludeUnpublished") === "true";
    const quizsets = await quizsetService.getQuizsets(excludeUnpublished);
    return NextResponse.json(quizsets);
  } catch (error: any) {
    console.error("[QUIZSET_GET_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch quizsets" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('body',body)
    const quizset = await quizsetService.createQuizset(body);
    return NextResponse.json(quizset, { status: 201 });
  } catch (error: any) {
    console.error("[QUIZSET_POST_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to create quizset" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
