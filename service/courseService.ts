import { getLoggedInUser } from "@/lib/loggedInUser";
import { Course } from "@/model/course";

interface CourseData {
  title: string;
  description: string;
  instructor?: string;
}

export const createCourse = async (data: CourseData) => {
      console.log("createCourse called with data:", data);
  const loggedInUser = await getLoggedInUser();
  console.log('loggeduser',loggedInUser)
  if (!loggedInUser) throw new Error("Unauthorized");
   data["instructor"] = loggedInUser?.id

  const existing = await Course.findOne({
    title: { $regex: `^${data.title}$`, $options: "i" },
    instructor: loggedInUser.instructor,
  });

  if (existing) {
    throw new Error("A course with this title already exists.");
  }

//   const course = await Course.create({
//     ...data,
//     instructor: user.id,
//     status: false,
//   });
   const course = await Course.create(data);
        return JSON.parse(JSON.stringify(course));

//   return course;
};

export const updateCourse = async (
  courseId: string,
  data: Partial<{ title: string; description: string; price: number }>
) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, data, {
      new: true,
    });
    return updatedCourse;
  } catch (error: any) {
    throw new Error("Failed to update course: " + error.message);
  }
};

export const changeCoursePublishState = async (
  courseId: string
): Promise<boolean> => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  course.status = !course.status;
  await course.save();
  return course.status;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  const deleted = await Course.findByIdAndDelete(courseId);
  if (!deleted) throw new Error("Course not found or failed to delete");
};
