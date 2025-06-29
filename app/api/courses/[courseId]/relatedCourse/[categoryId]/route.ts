import { NextRequest } from "next/server";
import { CourseRepository } from "@/app/respositories/CourseRepository";
import { CourseService } from "@/service/CourseService";

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string; categoryId: string } }
) {
  const { courseId, categoryId } = params;

  try {
    const relatedCourses = await courseService.getRelatedCourses(courseId, categoryId);
    return Response.json(relatedCourses, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch related courses", error: error.message },
      { status: 500 }
    );
  }
}
