import { getLoggedInUser } from "@/lib/loggedInUser";
import { DocumentWithId } from "@/lib/convertData";
import { Category } from "@/model/category";

import { ICategory } from "@/app/interfaces/ICategory";
import { ICategoryRepository } from "@/app/interfaces/ICategoryRepository";
import { ICategoryService } from "@/app/interfaces/ICategoryService";

export class CategoryService implements ICategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async createCategory(data: Partial<ICategory>): Promise<DocumentWithId> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const existing = await Category.findOne({
      title: { $regex: `^${data.title}$`, $options: "i" },
    });
    if (existing) {
      throw new Error("A category with this title already exists");
    }

    const categoryData = {
      ...data,
    };

    return this.categoryRepository.createCategory(categoryData);
  }

  async getCategories(): Promise<DocumentWithId[]> {
    return this.categoryRepository.getCategories();
  }

  async getCategory(id: string): Promise<DocumentWithId | null> {
    console.log("service", id);

    return this.categoryRepository.getCategory(id);
  }

  async updateCategory(
    categoryId: string,
    data: Partial<ICategory>
  ): Promise<DocumentWithId | null> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return this.categoryRepository.updateCategory(categoryId, data);
  }

  async changeCategoryPublishState(categoryId: string): Promise<boolean> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return this.categoryRepository.changeCategoryPublishState(categoryId);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return this.categoryRepository.deleteCategory(categoryId);
  }
}
