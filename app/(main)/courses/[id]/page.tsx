 'use client'
import { formatPrice } from "@/lib/formatPrice";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import RelatedCourses from "./_components/RelatedCourses";

import { replaceMongoIdInArray } from "@/lib/convertData";
import { useCourseDetails, useRelatedCourses } from "@/app/hooks/useCourse";
import { use } from "react";

const SingleCoursePage = ({ params }: { params: Promise<{ id: string }> }) => {
    // const { id } = params;
  // const courseId = params.id;
   const { id: courseId } = use(params);
 
   const { data: course, isLoading, isError } = useCourseDetails(courseId);
 // Use categoryId only after course is fetched
  const categoryId = course?.category?._id.toString()|| course?.category?.id  // adjust as per your course schema
  const {
    data: relatedCourses,
    isLoading: relatedLoading,
  } = useRelatedCourses(courseId, categoryId);
  console.log('related',relatedCourses)

;

  if (isLoading) return <div>Loading course...</div>;
  if (isError) return <div>Failed to load course.</div>;
  if (!course) return <div>No course found.</div>;
  return (
    <>
     <CourseDetailsIntro 
      course={course}
      />

      <CourseDetails course={course} />
    {
      course?.testimonials && <Testimonials testimonials={replaceMongoIdInArray(course?.testimonials)} />   
    }
      
      
       {relatedCourses?.length > 0 && (
        <RelatedCourses relatedCourses={relatedCourses} />
      )}
      
    </>
  );
};
export default SingleCoursePage;
