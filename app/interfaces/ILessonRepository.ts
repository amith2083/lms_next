import { DocumentWithId } from "@/lib/convertData";
import { ILesson } from "./ILesson";


export interface ILessonRepository {
  createLesson(data: Partial<ILesson>, moduleId: string): Promise<DocumentWithId>;
  getLesson(lessonId: string): Promise<DocumentWithId | null>;
  updateLesson(lessonId: string, data: Partial<ILesson>): Promise<DocumentWithId | null>;
  changeLessonPublishState(lessonId: string): Promise<boolean>;
  deleteLesson(lessonId: string, moduleId: string): Promise<void>;
}