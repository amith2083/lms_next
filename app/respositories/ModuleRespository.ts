import { DocumentWithId, replaceMongoIdInObject } from "@/lib/convertData";
import { IModuleRepository } from "../interfaces/IModuleRepository";
import { IModule } from "../interfaces/IModule";
import { Course } from "@/model/course";
import { Module } from "@/model/module";
import { Lesson } from "@/model/lesson";
import mongoose from "mongoose";

export class ModuleRepository implements IModuleRepository {
  async createModule(data: Partial<IModule>): Promise<DocumentWithId> {
    const session = await mongoose.startSession(); // 1. Start session (like starting a DB transaction)
    session.startTransaction(); // 2. Begin the transaction

    try {
      // 3. Create the module within this session
      const createdModules = await Module.create([data], { session });
      const createdModule = createdModules[0]; // Create returns an array when used with sessions

      // 4. Fetch the course and link the module
      const course = await Course.findById(data.courseId).session(session);
      if (!course) throw new Error("Course not found");

      course.modules.push(createdModule._id);
      await course.save({ session }); // Save within the same transaction

      // 5. Everything succeeded, commit the transaction
      await session.commitTransaction();
      session.endSession();
      return JSON.parse(JSON.stringify(createdModule));
    } catch (error) {
      // ❌ Something failed → undo everything (rollback)
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
   
  }

  async getModule(moduleId: string): Promise<DocumentWithId | null> {
    const moduleWithLesson = await Module.findById(moduleId)
      .populate({ path: "lessonIds", model: Lesson })
      .lean();
    return moduleWithLesson ? replaceMongoIdInObject(moduleWithLesson) : null;
  }

  async updateModule(
    moduleId: string,
    data: Partial<IModule>
  ): Promise<DocumentWithId | null> {
    const updatedModule = await Module.findByIdAndUpdate(moduleId, data, {
      new: true,
    }).lean();
    return updatedModule ? replaceMongoIdInObject(updatedModule) : null;
  }

  async changeModulePublishState(moduleId: string): Promise<boolean> {
    const module = await Module.findById(moduleId);
    if (!module) throw new Error("Module not found");

    module.status = !module.status;
    await module.save();
    return module.status;
  }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    course.modules = course.modules.filter((id) => id.toString() !== moduleId);
    await course.save();

    const deleted = await Module.findByIdAndDelete(moduleId);
    if (!deleted) throw new Error("Module not found or failed to delete");
  }
}
