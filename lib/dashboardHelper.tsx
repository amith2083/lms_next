import { auth } from "@/auth";
import { getCourseDetailsByInstructor } from "@/queries/courses";
import { getUserByEmail } from "@/queries/users";

export const COURSE_DATA = "course";

// Define the data type for the allowed values
type DashboardDataType = "course"; // extend if needed (e.g., "student", "revenue", etc.)

export async function getInstructorDashboardData(dataType: DashboardDataType) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthenticated: No user email found in session.");
    }

    const instructor = await getUserByEmail(session.user.email);
    console.log('itheins',instructor)

    if (!instructor?.id) {
      throw new Error("Instructor not found.");
    }

    const data = await getCourseDetailsByInstructor(instructor.id);
    console.log('data',data)

   return data

    // Optional: Handle unexpected dataType (if type changes in the future)
    // throw new Error(`Unknown dataType: ${dataType}`);

  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch dashboard data.");
  }
}
