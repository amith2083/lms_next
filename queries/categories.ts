import { Category } from "@/model/category";




export const getCategoeies = async () => {
  const categories = await Category.find()
   
  return categories;
};
