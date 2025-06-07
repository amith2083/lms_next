

import { Course } from "@/model/course";

export const updateCourse = async (courseId: string, data: Partial<{ title: string; description: string; price: number }>) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, data, { new: true });
    return updatedCourse;
  } catch (error: any) {
    throw new Error("Failed to update course: " + error.message);
  }
};