import { DocumentWithId } from "@/lib/convertData";
import { ICourse } from "./ICourse";


export interface ICourseRepository {
  getCourses(): Promise<DocumentWithId[]>;
  getCoursesForAdmin(): Promise<DocumentWithId[]>;
  getCourseDetails(id: string): Promise<DocumentWithId | null>;
  getCourseDetailsByInstructor(instructorId: string): Promise<DocumentWithId[]>;
  createCourse(data: Partial<ICourse>): Promise<DocumentWithId>;
  updateCourse(courseId: string, data: Partial<ICourse>): Promise<DocumentWithId | null>;
  changeCoursePublishState(courseId: string): Promise<boolean>;
  deleteCourse(courseId: string): Promise<void>;
  updateQuizSetForCourse(courseId: string, quizSetId: string): Promise<DocumentWithId | null>;
  getRelatedCourses (courseId: string, categoryId: string): Promise<DocumentWithId[]>;
}