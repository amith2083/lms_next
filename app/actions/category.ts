
// import { replaceMongoIdInObject } from "@/lib/convertData";
// import { getLoggedInUser } from "@/lib/loggedInUser";
// import { Category } from "@/model/category";
// import { Create } from "@/queries/categories";

// export interface CategoryData {
//   title: string;
//   description: string;
// //    status?: boolean;
   


// }


// export const createCategory=async(data:CategoryData)=>{
//     try {
//         const loggedinUser = await getLoggedInUser();
//       if(loggedinUser?.role==='admin'){

//         const category = await Create(data);
//         console.log('cat',category)
//          return category;
//       }
        
       
       
//     } catch (error:any) {
//         throw new Error(error);
//     }
// }



// type UpdateCategoryData = Partial<{
//   title: string;
//   description: string;

 
// }>;
// export const updateCategory= async(  categoryId: string ,
//   dataToUpdate: UpdateCategoryData)=> {
//     try {
//         await Category.findByIdAndUpdate(categoryId,dataToUpdate);
//     } catch (e:any) {
//         throw new Error(e);
//     }
// }



// export const changeCategoryPublishState = async (categoryId: string): Promise<boolean> => {
//   try {
//     const category = await Category.findById(categoryId);
//     if (!category) throw new Error("category not found");

//     const updated = await Category.findByIdAndUpdate(
//       categoryId,
//       { status: !category.status },
//       { new: true, lean: true }
//     );

//     if (!updated) throw new Error("Failed to update category");

//     return updated?.status;
//   } catch (e) {
//     if (e instanceof Error) {
//       throw new Error(e.message);
//     } else {
//       throw new Error("Unknown error occurred during changing publish state");
//     }
//   }
// };


// export const deleteCategory = async (

//   categoryId: string
// ): Promise<void> => {
//   try {
   

    
   
//     await Category.findByIdAndDelete(categoryId);
    
//   } catch (e) {
//     if (e instanceof Error) {
//       throw new Error(e.message);
//     } else {
//       throw new Error("Unknown error occurred during category deletion");
//     }
//   }
// };