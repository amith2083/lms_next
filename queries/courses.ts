import { replaceMongoIdInArray, replaceMongoIdInObject, MongoDocument, DocumentWithId } from "@/lib/convertData";
import { Category } from "@/model/category";
import { Course } from "@/model/course";
import { Module } from "@/model/module";
import { Testimonial } from "@/model/testimonial";
import { User } from "@/model/user";

// Define a specific type for populated Course
interface PopulatedCourse extends MongoDocument {
  category: MongoDocument;
  instructor: MongoDocument;
  testimonials: MongoDocument[];
  modules: MongoDocument[];
}

// Type for populated Testimonial with nested user
interface PopulatedTestimonial extends MongoDocument {
  users: MongoDocument;
}

interface CourseData {
  title: string;
  description: string;
 
 
  // add any other fields as per your schema
}


export const getCourses = async (): Promise<DocumentWithId[]> => {
  const courses: PopulatedCourse[] = await Course.find({active:true})
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
    })
    .populate({
      path: "modules",
      model: Module,
    });

  return replaceMongoIdInArray(courses);
};

export const getCourseDetails = async (id: string): Promise<DocumentWithId | null> => {
  const courseDetails: PopulatedCourse | null = await Course.findById(id)
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
      populate: {
        path: "users",
        model: User,
      },
    })
    .populate({
      path: "modules",
      model: Module,
    }).lean();

  return courseDetails ? replaceMongoIdInObject(courseDetails) : null;
};

export const getCourseDetailsByInstructor= async(instructorId)=>{
 
    const publishCourses = await Course.find({instructor: instructorId, })
    .populate({path: "category", model: Category })
    .populate({path: "testimonials", model: Testimonial })
    .populate({ path: "instructor", model: User})
    .lean();
   console.log('publiccourses',publishCourses)
   return publishCourses
}

export const Create = async(courseData:CourseData)=> {
    try {
        const course = await Course.create(courseData);
        return JSON.parse(JSON.stringify(course));
    } catch (error:any) {
        throw new Error(error);
    }
}