import { NextRequest, NextResponse } from "next/server";
import { EnrollmentService } from "@/service/EnrollmentService";
import { getLoggedInUser } from "@/lib/loggedInUser";
import { EnrollmentRepository } from "@/app/respositories/EnrollmentRepository";
import { CourseRepository } from "@/app/respositories/CourseRepository";
import { UserRepository } from "@/app/respositories/UserRepository";
import { CourseService } from "@/service/CourseService";
import { UserService } from "@/service/UserService";
import { dbConnect } from "@/service/mongo";

// const enrollmentRepository = new EnrollmentRepository();
// const enrollmentService = new EnrollmentService(enrollmentRepository);
const courseRepository = new CourseRepository();
const userRepository = new UserRepository();

const courseService = new CourseService(courseRepository);
const userService = new UserService(userRepository);

const enrollmentRepository = new EnrollmentRepository();
const enrollmentService = new EnrollmentService(enrollmentRepository, courseService, userService);

export async function GET(req: NextRequest) {
     await dbConnect()
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    const enrollments = await enrollmentService.getEnrollmentsForUser(user.id);
    return NextResponse.json(enrollments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
