import { QuizsetRepository } from "@/app/respositories/QuizsetRepository";
import { QuizsetService } from "@/service/QuizsetService";
import { NextRequest, NextResponse } from "next/server";

const quizsetRepository = new QuizsetRepository();
const quizsetService = new QuizsetService(quizsetRepository);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizsetId: string; quizId: string } }
) {
  try {
    await quizsetService.deleteQuizFromQuizset(params.quizsetId, params.quizId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[QUIZSET_DELETE_QUIZ_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete quiz from quizset" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}