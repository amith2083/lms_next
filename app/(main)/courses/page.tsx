'use client'

import { getCourses } from "@/queries/courses";
import ActiveFilters from "./_components/ActiveFilters";
import CourseCard from "./_components/CourseCard";
import FilterCourse from "./_components/FilterCourse";
import FilterCourseMobile from "./_components/FilterCourseMobile";

import SortCourse from "./_components/SortCourse";
import SearchCourse from "./_components/SearchCourse";
import { useState } from "react";
import { useListCourses } from "@/app/hooks/useListCourses";
import {  useGetCategories } from "@/app/hooks/useCategories";
import SkeletonCourseCard from "./_components/skeleton";

 


 
const CoursesPage =  () => {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useListCourses(page);
    const { data:categories = [], isLoading: isLoadingCategories } = useGetCategories();
   
    const courses =data?.courses
    
  // const courses = await getCourses();
    // if (isLoading) return <div>Loading...</div>;

  return (
    <section
      id="courses"
      className="container space-y-6   dark:bg-transparent py-6"
    >
      {/* <h2 className="text-xl md:text-2xl font-medium">All Courses</h2> */}
      {/* header */}
      <div className="flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row">
        
        <SearchCourse/>

        <div className="flex items-center justify-end gap-2 max-lg:w-full">
         
         <SortCourse/>

          {/* Filter Menus For Mobile */}

          <FilterCourseMobile/>
        </div>
      </div>
      {/* header ends */}
      {/* active filters */}

      <ActiveFilters 
        filter={{
            categories: ["development"],
            price: ["free"],
            sort: ""
        }}
      />
    
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          {/* these component can be re use for mobile also */}
         {isLoadingCategories ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              ))}
            </div>
          ) : (
            <FilterCourse categories={categories} isLoading={isLoadingCategories} />
          )}

          {/* Course grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
             {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCourseCard key={i} />
                ))
              : courses?.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
        </div>
      </section>
       {/* Pagination */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Prev
        </button>
        <span className="px-4 py-2">{page}</span>
        <button
          onClick={() =>
            setPage((prev) =>
              data?.totalPages && prev < data.totalPages ? prev + 1 : prev
            )
          }
          disabled={page === data?.totalPages}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </section>
  );
};
export default CoursesPage;