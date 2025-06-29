import { IModule } from "./IModule";
import { DocumentWithId } from "@/lib/convertData";

export interface IModuleService {
  createModule(data: Partial<IModule>): Promise<DocumentWithId>;
  getModule(moduleId: string): Promise<DocumentWithId | null>;
  updateModule(moduleId: string, data: Partial<IModule>): Promise<DocumentWithId | null>;
  changeModulePublishState(moduleId: string): Promise<boolean>;
  deleteModule(moduleId: string, courseId: string): Promise<void>;
}
