import { NextRequest, NextResponse } from "next/server";
import { getCourses } from "@/queries/courses";

export async function GET(req: NextRequest) {
  try {
    // Read pagination query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    // For now, use getCourses() without pagination
    const allCourses = await getCourses();

    // Manual pagination
    const start = (page - 1) * limit;
    const paginatedCourses = allCourses.slice(start, start + limit);

    return NextResponse.json({
      courses: paginatedCourses,
      total: allCourses.length,
      totalPages: Math.ceil(allCourses.length / limit),
      page,
    });
  } catch (error) {
    console.error("Error loading courses:", error);
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
  }
}
