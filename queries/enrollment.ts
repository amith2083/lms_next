import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Course } from "@/model/course";
import { Enrollment } from "@/model/enrollment";
 

export async function getEnrollmentsForCourse(courseId){
    const enrollments = await Enrollment.find({course: courseId}).lean();
    return replaceMongoIdInArray(enrollments);
}


export async function enrollForCourse(courseId, userId, paymentMethod){
  
    try {
        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        });

        if (existingEnrollment) {
            throw new Error("User is already enrolled in this course.");
        }
          const newEnrollment = {
        course: courseId,
        student: userId,
        method: paymentMethod,
        enrollment_date: Date.now(),
        status: 'not-started'
    }
        
        const response = await Enrollment.create(newEnrollment);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getEnrollmentsForUser(userId){
    try {
        const enrollments = await Enrollment.find({ student: userId})
        .populate({
            path: "course",
            model: Course,
        }).lean();
        return replaceMongoIdInArray(enrollments);
    } catch (err) {
        throw new Error(err);
    }

}