import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData"; 
import { Testimonial } from "@/model/testimonial";


export async function getTestimonialsForCourse(courseId){
    const testimonials = await Testimonial.find({courseId: courseId}).lean();
    return replaceMongoIdInArray(testimonials);
}