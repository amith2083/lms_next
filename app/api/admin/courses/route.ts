// app/api/courses/route.ts
import { NextResponse } from "next/server";

// import {  getCourses } from "@/queries/courses";
import { dbConnect } from "@/service/mongo";
import { Course } from "@/model/course";
import { getCoursesForAdmin } from "@/queries/courses";


export const GET = async () => {
  try {
    await dbConnect();
    const courses = await getCoursesForAdmin();

    //  const coursesData = await getCourses(); // fetch courses
    // const courses = coursesData.sort((a, b) => {
    //   return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    // });
    
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch courses" }, { status: 500 });
  }
};



export const PUT = async (req: Request) => {
  const { courseId } = await req.json();

  await dbConnect();

  const course = await Course.findById(courseId);
 
  if (!course) {
    return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  }

  if (course.isApproved) {
    return NextResponse.json({ message: 'Course is already approved' }, { status: 400 });
  }

  course.isApproved = true;
  await course.save();

  return NextResponse.json({ message: 'Course approved successfully' });
};