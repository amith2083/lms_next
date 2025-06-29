
import { getLoggedInUser } from "@/lib/loggedInUser";
import { DocumentWithId } from "@/lib/convertData";
import { Course } from "@/model/course";
import { ICourseRepository } from "@/app/interfaces/ICourseRepository";
import { ICourse } from "@/app/interfaces/ICourse";
import { ICourseService } from "@/app/interfaces/ICourseService";
import mongoose from "mongoose";

export class CourseService implements ICourseService {
  constructor(private courseRepository: ICourseRepository) {}

  async createCourse(data: Partial<ICourse>): Promise<DocumentWithId> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized");

    const existing = await Course.findOne({
      title: { $regex: `^${data.title}$`, $options: "i" },
      instructor: loggedInUser.id,
    });

    if (existing) {
      throw new Error("A course with this title already exists.");
    }

    const courseData = {
      ...data,
      instructor: loggedInUser.id,
      status: false,
    };

    return this.courseRepository.createCourse(courseData);
  }

  async getCourses(): Promise<DocumentWithId[]> {
    return this.courseRepository.getCourses();
  }

  async getCoursesForAdmin(): Promise<DocumentWithId[]> {
    return this.courseRepository.getCoursesForAdmin();
  }

  async getCourseDetails(id: string): Promise<DocumentWithId | null> {
    return this.courseRepository.getCourseDetails(id);
  }

  async getCourseDetailsByInstructor(instructorId: string): Promise<DocumentWithId[]> {
    return this.courseRepository.getCourseDetailsByInstructor(instructorId);
  }

  async updateCourse(courseId: string, data: Partial<ICourse>): Promise<DocumentWithId | null> {
    return this.courseRepository.updateCourse(courseId, data);
  }

  async changeCoursePublishState(courseId: string): Promise<boolean> {
    return this.courseRepository.changeCoursePublishState(courseId);
  }

  async deleteCourse(courseId: string): Promise<void> {
    return this.courseRepository.deleteCourse(courseId);
  }
  
 async updateQuizSetForCourse (courseId: string, quizSetId: string) {
    const updateData = {
      quizSet: new mongoose.Types.ObjectId(quizSetId),
    };

    return await this.courseRepository.updateQuizSetForCourse(courseId, updateData);
  }

  async getRelatedCourses(courseId:string, categoryId:string) {
        try {
            const relatedCourses = await this.courseRepository.getRelatedCourses(courseId, categoryId);
            
            // Example: Add business logic if needed
            // E.g., limit to 5 courses
            return relatedCourses
        } catch (error) {
            throw new Error("Error in getting related courses: " + error.message);
        }
    }

}