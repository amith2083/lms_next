import { getInstructorDashboardData, COURSE_DATA } from "@/lib/dashboardHelper";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { sanitizeData } from "@/utils/sanitize";

// Define a generic type for course objects (you can replace it with a specific interface if you have one)
interface Course {
  [key: string]: any;
}

const CoursesPage = async (): Promise<JSX.Element> => {
  const rawData = await getInstructorDashboardData(COURSE_DATA);
  const courses: Course[] = sanitizeData(rawData || []);
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
