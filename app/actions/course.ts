'use server'
import { getLoggedInUser } from "@/lib/loggedInUser";
import { Course } from "@/model/course";
import { Create } from "@/queries/courses";

interface CourseData {
  title: string;
  description: string;
   instructor?: string;

}
type UpdateCourseData = Partial<{
  title: string;
  description: string;
  price: number;
 
}>;


export async function createCourse(data:CourseData){
    try {
        const loggedinUser = await getLoggedInUser();
        data["instructor"] = loggedinUser?.id
        const course = await Create(data);
       
        return course;
    } catch (error:any) {
        throw new Error(error);
    }
}

export const updateCourse= async(  courseId: string ,
  dataToUpdate: UpdateCourseData)=> {
    try {
        await Course.findByIdAndUpdate(courseId,dataToUpdate);
    } catch (e:any) {
        throw new Error(e);
    }
}