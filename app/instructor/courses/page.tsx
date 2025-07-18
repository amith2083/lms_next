
"use client";

import { useInstructorCourses } from "@/app/hooks/useCourse";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { sanitizeData } from "@/utils/sanitize";


interface Course {
  [key: string]: any;
}

const CoursesPage = (): JSX.Element => {
  // const rawData = await getInstructorDashboardData(COURSE_DATA);
  const { data, isLoading, error } = useInstructorCourses();

  if (isLoading) return <p>Loading courses...</p>;
  if (error) return <p>Failed to load courses</p>;

  const courses = sanitizeData(data || []);
  console.log(courses);

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
