import { CategoryData } from "@/app/actions/category";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category";


export const GetAllCategories = async () => {
  try {
    // const categories = await Category.find(); 
    // return categories;
     const categories = await Category.find({}).lean();
    return replaceMongoIdInArray(categories);
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const getCategory = async (id: string) => {
  const category = await Category.findById(id).lean();

  return category ? replaceMongoIdInObject(category) : null;
};
export const Create = async(categoryData:CategoryData)=> {
  console.log('querycategorydata',categoryData)
    try {
        const category = await Category.create(categoryData);
        console.log('res',category)
        return JSON.parse(JSON.stringify(category));
    } catch (error:any) {
        throw new Error(error);
    }
}

