import { Category } from "@/model/category";
import { Course } from "@/model/course";
import { Module } from "@/model/module";
import { Testimonial } from "@/model/testimonial";
import { User } from "@/model/user";

export const getCourses = async () => {
  const courses = await Course.find()
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
    }).populate({
        path: "modules",
        model: Module
      })
  return courses;
};
