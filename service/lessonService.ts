
import { ILesson } from "@/app/interfaces/ILesson";
import { ILessonRepository } from "@/app/interfaces/ILessonRepository";
import { ILessonService } from "@/app/interfaces/ILessonService";
import { DocumentWithId } from "@/lib/convertData";
import { Lesson } from "@/model/lesson";


export class LessonService implements ILessonService {
  constructor(private lessonRepository: ILessonRepository) {}

  async createLesson(data: Partial<ILesson>, moduleId: string): Promise<DocumentWithId> {
    const existing = await Lesson.findOne({
      title: { $regex: `^${data.title}$`, $options: "i" },
      // Note: We don't check moduleId here as lessons are not directly tied to modules in the schema
    });

    if (existing) {
      throw new Error("A lesson with this title already exists.");
    }

    return this.lessonRepository.createLesson(data, moduleId);
  }

  async getLesson(lessonId: string): Promise<DocumentWithId | null> {
    const lesson = await this.lessonRepository.getLesson(lessonId);
    if (!lesson) throw new Error("Lesson not found");
    return lesson;
  }

  async updateLesson(lessonId: string, data: Partial<ILesson>): Promise<DocumentWithId | null> {
    return this.lessonRepository.updateLesson(lessonId, data);
  }

  async changeLessonPublishState(lessonId: string): Promise<boolean> {
    return this.lessonRepository.changeLessonPublishState(lessonId);
  }

  async deleteLesson(lessonId: string, moduleId: string): Promise<void> {
    return this.lessonRepository.deleteLesson(lessonId, moduleId);
  }
}