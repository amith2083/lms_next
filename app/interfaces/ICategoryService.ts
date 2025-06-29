import { ICategory } from "./ICategory";
import { DocumentWithId } from "@/lib/convertData";

export interface ICategoryService {
  createCategory(data: Partial<ICategory>): Promise<DocumentWithId>;
  getCategories(): Promise<DocumentWithId[]>;
  getCategory(id: string): Promise<DocumentWithId | null>;
  updateCategory(categoryId: string, data: Partial<ICategory>): Promise<DocumentWithId | null>;
  changeCategoryPublishState(categoryId: string): Promise<boolean>;
  deleteCategory(categoryId: string): Promise<void>;
}
