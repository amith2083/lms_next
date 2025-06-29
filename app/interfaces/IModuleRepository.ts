import { DocumentWithId } from "@/lib/convertData";
import { IModule } from "./IModule";


export interface IModuleRepository {
  createModule(data: Partial<IModule>): Promise<DocumentWithId>;
  getModule(moduleId: string): Promise<DocumentWithId | null>;
  updateModule(moduleId: string, data: Partial<IModule>): Promise<DocumentWithId | null>;
  changeModulePublishState(moduleId: string): Promise<boolean>;
  deleteModule(moduleId: string, courseId: string): Promise<void>;
}