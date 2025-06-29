'use client'
import { getInstructorDashboardData, COURSE_DATA } from "@/lib/dashboardHelper";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { sanitizeData } from "@/utils/sanitize";
import { GetAllCategories } from "@/queries/categories";
import { useGetCategories } from "@/app/hooks/useCategories";
import { JSX } from "react";

// Define a generic type for course objects (you can replace it with a specific interface if you have one)
interface Category {
  [key: string]: any;
}

const CategoryPage =  (): JSX.Element => {
  // const rawData = await GetAllCategories();
    const { data: rawData, isLoading,error } = useGetCategories();
  const categories: Category[] = sanitizeData(rawData || []);
  console.log(categories);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !categories) {
    return <div>Error: Category not found</div>;
  }

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={categories} />
    </div>
  );
};

export default CategoryPage;