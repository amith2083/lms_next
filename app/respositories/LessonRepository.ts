
import { DocumentWithId, replaceMongoIdInObject } from "@/lib/convertData";
import { ILessonRepository } from "../interfaces/ILessonRepository";
import { ILesson } from "../interfaces/ILesson";
import { Module } from "@/model/module";
import { Lesson } from "@/model/lesson";


export class LessonRepository implements ILessonRepository {
  async createLesson(data: Partial<ILesson>, moduleId: string): Promise<DocumentWithId> {
    const createdLesson = await Lesson.create(data);
    const module = await Module.findById(moduleId);
    if (!module) throw new Error("Module not found");

    module.lessonIds.push(createdLesson._id);
    await module.save();

    return JSON.parse(JSON.stringify(createdLesson));
  }

  async getLesson(lessonId: string): Promise<DocumentWithId | null> {
    const lesson = await Lesson.findById(lessonId).lean();
    return lesson ? replaceMongoIdInObject(lesson) : null;
  }

  async updateLesson(lessonId: string, data: Partial<ILesson>): Promise<DocumentWithId | null> {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, data, { new: true }).lean();
    return updatedLesson ? replaceMongoIdInObject(updatedLesson) : null;
  }

  async changeLessonPublishState(lessonId: string): Promise<boolean> {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new Error("Lesson not found");

    lesson.active = !lesson.active;
    await lesson.save();
    return lesson.active;
  }

  async deleteLesson(lessonId: string, moduleId: string): Promise<void> {
    const module = await Module.findById(moduleId);
    if (!module) throw new Error("Module not found");

    module.lessonIds = module.lessonIds.filter((id) => id.toString() !== lessonId);
    await module.save();

    const deleted = await Lesson.findByIdAndDelete(lessonId);
    if (!deleted) throw new Error("Lesson not found or failed to delete");
  }
}