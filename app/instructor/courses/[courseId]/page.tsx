'use client'
import {
  CircleDollarSign,
  ListChecks,
} from "lucide-react";

// import { getCourseDetails } from "@/queries/courses";

import { CourseActions } from "./_components/course-action";
import { TitleForm } from "./_components/title";
import { SubTitleForm } from "./_components/sub-title-form";
import { DescriptionForm } from "./_components/description";
import { ImageForm } from "./_components/image-form";
import { QuizSetForm } from "./_components/quiz-form";
import { ModulesForm } from "./_components/module-form";
import { PriceForm } from "./_components/price-form";
import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import { sanitizeData } from "@/utils/sanitize";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { CategoryForm } from "./_components/category-form";
// import { GetAllCategories } from "@/queries/categories";

import { useGetCategories } from "@/app/hooks/useCategories";
import { useGetQuizsets } from "@/app/hooks/useQuiz";
import { useCourseDetails } from "@/app/hooks/useCourse";




interface CoursePageProps {
  params: {
    courseId: string;
  };
}

const EditCourse =  ({ params }: CoursePageProps) => {
    const{courseId}= params
 

  // const course = await getCourseDetails(courseId);
  const { data: course, isLoading: isLoadingCourse } = useCourseDetails(courseId);
  const { data:categories = [], isLoading: isLoadingCategories } = useGetCategories();
  
 const{data:allQuizSets,isLoading}= useGetQuizsets()
  
  

    // const categories = await GetAllCategories();
  
   if (isLoadingCourse ) return <p className="p-6">Loading...</p>;
  if (!course) return <p className="p-6 text-red-500">Course not found.</p>;
  const mappedCategories = categories.map(c => {
    return {
      value: c.title,
      label: c.title,
      id: c.id,
    }
  });
   // Sanitize fucntion for handle ObjectID and Buffer




 const rawmodules =  replaceMongoIdInArray(course?.modules).sort((a,b) => a.order - b.order)||[];

 const modules = sanitizeData(rawmodules);

 let mappedQuizSet = [];
  if (allQuizSets && allQuizSets.length > 0) {
    mappedQuizSet = allQuizSets.map(quizSet => {
      return {
        value: quizSet.id,
        label: quizSet.title,
      }
    })
  }
  return (
    <>
       {
     !course?.status &&  <AlertBanner
     label="This course is unpublished. It will not be visible in the course."
     variant="warning"
   />
    }
      <div className="p-6">
        <div className="flex items-center justify-end">
          <CourseActions courseId ={courseId} status ={course?.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={{ title: course?.title }}
              courseId={courseId}
            />
            <SubTitleForm
              initialData={{ subtitle: course?.subtitle }}
              courseId={courseId}
            />
            <DescriptionForm
              initialData={{ description: course?.description }}
              courseId={courseId}
            />
            <ImageForm
              initialData={{ imageUrl: `/assets/images/courses/${course?.thumbnail}` }}
              courseId={courseId}
            />
             <CategoryForm initialData={{value: course?.category?.title }} courseId={courseId} options={mappedCategories} />

            <QuizSetForm initialData={{ quizSetId: course?.quizSet?.toString()  }} courseId={courseId} options={mappedQuizSet} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-6">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Modules</h2>
              </div>
              <ModulesForm initialData={modules} courseId={courseId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={{ price: course?.price }} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCourse;
