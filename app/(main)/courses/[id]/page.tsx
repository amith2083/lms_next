 'use client'
import { formatPrice } from "@/lib/formatPrice";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import RelatedCourses from "./_components/RelatedCourses";
import { useCourseDetails } from "@/app/hooks/useCourseDetails";
import { replaceMongoIdInArray } from "@/lib/convertData";

const SingleCoursePage = ({ params }: { params: { id: string } }) => {
    // const { id } = params;
  const courseId = params.id;
 
   const { data: course, isLoading, isError } = useCourseDetails(courseId);

  console.log('Course ID:', courseId);
  console.log('Course Data:', course);

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
      
      
     <RelatedCourses/>
      
    </>
  );
};
export default SingleCoursePage;
