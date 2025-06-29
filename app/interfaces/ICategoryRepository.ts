import { DocumentWithId } from "@/lib/convertData";
import { ICategory } from "./ICategory";

export interface ICategoryRepository {
  getCategories(): Promise<DocumentWithId[]>;
  getCategory(id: string): Promise<DocumentWithId | null>;
  createCategory(data: Partial<ICategory>): Promise<DocumentWithId>;
  updateCategory(categoryId: string, data: Partial<ICategory>): Promise<DocumentWithId | null>;
  changeCategoryPublishState(categoryId: string): Promise<boolean>;
  deleteCategory(categoryId: string): Promise<void>;
}