import React from "react";
import { Presentation } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Star } from "lucide-react";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { getCourseDetailsByInstructor } from "@/queries/courses";
import { useInstructorCourses } from "@/app/hooks/useCourse";

const CourseInstructor = ({ course }) => {
  const instructor = course?.instructor;
  const fullName = `${instructor?.name}`;
  //console.log(course);

  // const courseDetailsByInstructor = await getCourseDetailsByInstructor(instructor._id.toString());
  const {
    data: courseDetailsByInstructor,
    isLoading,
    isError,
  } = useInstructorCourses();

  console.log(courseDetailsByInstructor);

  return (
    <div className="bg-gray-50 rounded-md p-8">
      <div className="md:flex md:gap-x-5 mb-8">
        <div className="h-[310px] w-[270px] max-w-full  flex-none rounded mb-5 md:mb-0">
          <Image
            src={instructor?.profilePicture}
            alt={instructor?.name}
            width={120}
            height={120}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <div className="max-w-[300px]">
            <h4 className="text-[34px] font-bold leading-[51px]">{fullName}</h4>
            <div className="text-gray-600 font-medium mb-6">
              {instructor?.designation}
            </div>
            <ul className="list space-y-4">
              <li className="flex items-center space-x-3">
                <Presentation className="text-gray-600" />
                <div>{courseDetailsByInstructor?.courses} Courses</div>
              </li>
              <li className="flex space-x-3">
                <UsersRound className="text-gray-600" />
                <div>
                  {courseDetailsByInstructor?.enrollments}+ Student Learned
                </div>
              </li>
              <li className="flex space-x-3">
                <MessageSquare className="text-gray-600" />
                <div>{courseDetailsByInstructor?.reviews} Reviews</div>
              </li>
              <li className="flex space-x-3">
                <Star className="text-gray-600" />
                <div>{courseDetailsByInstructor?.ratings} Average Rating</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{instructor?.bio}</p>
    </div>
  );
};

export default CourseInstructor;
