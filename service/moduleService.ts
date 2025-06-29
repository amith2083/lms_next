
import { IModule } from "@/app/interfaces/IModule";
import { IModuleRepository } from "@/app/interfaces/IModuleRepository";
import { IModuleService } from "@/app/interfaces/IModuleService";
import { DocumentWithId } from "@/lib/convertData";
import { Module } from "@/model/module";

export class ModuleService implements IModuleService {
  constructor(private moduleRepository: IModuleRepository) {}

  async createModule(data: Partial<IModule>): Promise<DocumentWithId> {
    

    if (typeof data.order === "string") {
      data.order = parseInt(data.order);
    }
    const existing = await Module.findOne({
      title: { $regex: `^${data.title}$`, $options: "i" },
      courseId: data.courseId,
    });

    if (existing) {
      throw new Error("A module with this title already exists in the course.");
    }

    return this.moduleRepository.createModule(data);
  }

  async getModule(moduleId: string): Promise<DocumentWithId | null> {
    const module = await this.moduleRepository.getModule(moduleId);
    if (!module) throw new Error("Module not found");
    return module;
  }

  async updateModule(moduleId: string, data: Partial<IModule>): Promise<DocumentWithId | null> {
    return this.moduleRepository.updateModule(moduleId, data);
  }

  async changeModulePublishState(moduleId: string): Promise<boolean> {
    return this.moduleRepository.changeModulePublishState(moduleId);
  }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    return this.moduleRepository.deleteModule(moduleId, courseId);
  }
}