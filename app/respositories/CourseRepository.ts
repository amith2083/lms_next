import { Course } from "@/model/course";
import { Category } from "@/model/category";
import { User } from "@/model/user";
import { Testimonial } from "@/model/testimonial";
import { Module } from "@/model/module";

import { DocumentWithId, replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { ICourseRepository } from "../interfaces/ICourseRepository";
import { ICourse } from "../interfaces/ICourse";
import mongoose from "mongoose";


interface PopulatedCourse {
  category: any;
  instructor: any;
  testimonials: any[];
  modules: any[];
}

export class CourseRepository implements ICourseRepository {
  async getCourses(): Promise<DocumentWithId[]> {
    const courses: PopulatedCourse[] = await Course.find({ status: true, isApproved: true })
      .populate({ path: "category", model: Category })
      .populate({ path: "instructor", model: User })
      .populate({ path: "testimonials", model: Testimonial })
      .populate({ path: "modules", model: Module })
      .lean();
    return replaceMongoIdInArray(courses);
  }

  async getCoursesForAdmin(): Promise<DocumentWithId[]> {
    const courses: PopulatedCourse[] = await Course.find({ status: true })
      .populate({ path: "category", model: Category })
      .populate({ path: "instructor", model: User })
      .populate({ path: "testimonials", model: Testimonial })
      .populate({ path: "modules", model: Module })
      .lean();
    return replaceMongoIdInArray(courses);
  }

  async getCourseDetails(id: string): Promise<DocumentWithId | null> {
    const courseDetails: PopulatedCourse | null = await Course.findById(id)
      .populate({ path: "category", model: Category })
      .populate({ path: "instructor", model: User })
      .populate({
        path: "testimonials",
        model: Testimonial,
        populate: { path: "users", model: User },
      })
      .populate({ path: "modules", model: Module })
      .lean();
    return courseDetails ? replaceMongoIdInObject(courseDetails) : null;
  }

  async getCourseDetailsByInstructor(instructorId: string): Promise<DocumentWithId[]> {
    const courses = await Course.find({ instructor: instructorId })
      .populate({ path: "category", model: Category })
      .populate({ path: "testimonials", model: Testimonial })
      .populate({ path: "instructor", model: User })
      .lean();
    return replaceMongoIdInArray(courses);
  }

  async createCourse(data: Partial<ICourse>): Promise<DocumentWithId> {
    const course = await Course.create(data);
    return JSON.parse(JSON.stringify(course));
  }

  async updateCourse(courseId: string, data: Partial<ICourse>): Promise<DocumentWithId | null> {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, data, { new: true }).lean();
    return updatedCourse ? replaceMongoIdInObject(updatedCourse) : null;
  }

  async changeCoursePublishState(courseId: string): Promise<boolean> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");
    course.status = !course.status;
    await course.save();
    return course.status;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const deleted = await Course.findByIdAndDelete(courseId);
    if (!deleted) throw new Error("Course not found or failed to delete");
  }
  async updateQuizSetForCourse(courseId: string, data: any) {
    try {
      console.log('repo',courseId,data)
      return await Course.findByIdAndUpdate(courseId, data, { new: true });
    } catch (err: any) {
      throw new Error("Failed to update course: " + err.message);
    }
  }

   async getRelatedCourses(courseId:string, categoryId:string): Promise<DocumentWithId[]> {
  
        const currentCourseObjectId = new mongoose.Types.ObjectId(courseId);
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
       

        const relatedCourses = await Course.find({
            category: categoryObjectId,
            _id: { $ne: currentCourseObjectId },
            status:true,isApproved:true
           
        })
        .select("title thumbnail price")
        .lean();
     
        return  relatedCourses? replaceMongoIdInArray(relatedCourses):null
    }
}