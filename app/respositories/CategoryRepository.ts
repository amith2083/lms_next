import { Category } from "@/model/category";
import { DocumentWithId, replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

import { ICategory } from "../interfaces/ICategory";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { Course } from "@/model/course";

export class CategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<DocumentWithId[]> {
    const categories = await Category.find({}).lean();
    
    return replaceMongoIdInArray(categories);
  }

  async getCategory(id: string): Promise<DocumentWithId | null> {
  
   
    const category = await Category.findById(id).lean();
    console.log('Raw category from DB:', category);
    return category ? replaceMongoIdInObject(category) : null;
    // return category ? (console.log('Transformed category:', replaceMongoIdInObject(category)), replaceMongoIdInObject(category)) : null;
  }

  async createCategory(data: Partial<ICategory>): Promise<DocumentWithId> {
    const category = await Category.create(data);
    return JSON.parse(JSON.stringify(category));
  }

  async updateCategory(categoryId: string, data: Partial<ICategory>): Promise<DocumentWithId | null> {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, { new: true }).lean();
    return updatedCategory ? replaceMongoIdInObject(updatedCategory) : null;
  }

  async changeCategoryPublishState(categoryId: string): Promise<boolean> {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");
    category.status = !category.status;
    await category.save();
    return category.status;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");
    // Optional: Check for dependent courses
    const courses = await Course.find({ category: categoryId }).lean();
    if (courses.length > 0) {
      throw new Error("Cannot delete category with associated courses");
    }
    await Category.findByIdAndDelete(categoryId);
  }
}