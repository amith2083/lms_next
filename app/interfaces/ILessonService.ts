import { ILesson } from "./ILesson";
import { DocumentWithId } from "@/lib/convertData";

export interface ILessonService {
  createLesson(data: Partial<ILesson>, moduleId: string): Promise<DocumentWithId>;
  getLesson(lessonId: string): Promise<DocumentWithId | null>;
  updateLesson(lessonId: string, data: Partial<ILesson>): Promise<DocumentWithId | null>;
  changeLessonPublishState(lessonId: string): Promise<boolean>;
  deleteLesson(lessonId: string, moduleId: string): Promise<void>;
}
