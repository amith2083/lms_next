// 'use server'
// import { getLoggedInUser } from "@/lib/loggedInUser";
// import { Course,ICourse } from "@/model/course";
// import { Create } from "@/queries/categories";


// interface CourseData {
//   title: string;
//   description: string;
//    instructor?: string;

// }
// type UpdateCourseData = Partial<{
//   title: string;
//   description: string;
//   price: number;
 
// }>;



// export async function createCourse(data:CourseData){
//     try {
//         const loggedinUser = await getLoggedInUser();
//         data["instructor"] = loggedinUser?.id
//         // Check for existing course with the same title and instructor
//     const existingCourse = await Course.findOne({
//      title: { $regex: `^${data.title}$`, $options: "i" },
//       // instructor: data.instructor,
//     });

//     if (existingCourse) {
//       throw new Error("A course with this title already exists for this instructor");
//     }
//         const course = await Create(data);
       
//         return course;
//     } catch (error:any) {
//         throw new Error(error);
//     }
// }

// // export const updateCourse= async(  courseId: string ,
// //   dataToUpdate: UpdateCourseData)=> {
// //     try {
// //         await Course.findByIdAndUpdate(courseId,dataToUpdate);
// //     } catch (e:any) {
// //         throw new Error(e);
// //     }
// // }


// export const changeCoursePublishState = async (courseId: string): Promise<boolean> => {
//   try {
//     const course = await Course.findById(courseId);
//     if (!course) throw new Error("Course not found");

//     const updated = await Course.findByIdAndUpdate(
//       courseId,
//       { status: !course.status },
//       { new: true, lean: true }
//     );

//     if (!updated) throw new Error("Failed to update course");

//     return updated?.status;
//   } catch (e) {
//     if (e instanceof Error) {
//       throw new Error(e.message);
//     } else {
//       throw new Error("Unknown error occurred during changing publish state");
//     }
//   }
// };


// export const deleteCourse = async (

//   courseId: string
// ): Promise<void> => {
//   try {
   

    
   
//     await Course.findByIdAndDelete(courseId);
    
//   } catch (e) {
//     if (e instanceof Error) {
//       throw new Error(e.message);
//     } else {
//       throw new Error("Unknown error occurred during course deletion");
//     }
//   }
// };