import { QuizsetRepository } from "@/app/respositories/QuizsetRepository";
import { QuizsetService } from "@/service/QuizsetService";
import { NextRequest, NextResponse } from "next/server";

const quizsetRepository = new QuizsetRepository();
const quizsetService = new QuizsetService(quizsetRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { quizsetId: string } }
) {
  try {
    const quizset = await quizsetService.getQuizsetById(params.quizsetId);
    if (!quizset) {
      return NextResponse.json({ message: "Quizset not found" }, { status: 404 });
    }
    return NextResponse.json(quizset);
  } catch (error: any) {
    console.error("[QUIZSET_GET_BY_ID_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch quizset" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { quizsetId: string } }
) {
  try {
    const body = await req.json();
    const updatedQuizset = await quizsetService.updateQuizset(params.quizsetId, body);
    if (!updatedQuizset) {
      return NextResponse.json({ message: "Quizset not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuizset);
  } catch (error: any) {
    console.error("[QUIZSET_PUT_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to update quizset" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizsetId: string } }
) {
  try {
    await quizsetService.deleteQuizset(params.quizsetId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[QUIZSET_DELETE_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete quizset" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { quizsetId: string } }
) {
  try {
    const newState = await quizsetService.changeQuizsetPublishState(params.quizsetId);
    return NextResponse.json({ active: newState });
  } catch (error: any) {
    console.error("[QUIZSET_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to toggle quizset status" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { quizsetId: string } }
) {
  try {
    const body = await req.json();
    await quizsetService.addQuizToQuizset(params.quizsetId, body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("[QUIZSET_ADD_QUIZ_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to add quiz to quizset" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
