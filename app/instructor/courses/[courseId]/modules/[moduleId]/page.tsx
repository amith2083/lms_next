'use client'
import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  BookOpenCheck,
  Eye,
  LayoutDashboard, 
  Video,
} from "lucide-react";
import Link from "next/link";
import { ModuleTitleForm } from "./_components/module-title-form";
import { LessonForm } from "./_components/lesson-form";
import { CourseActions } from "../../_components/course-action";

import { replaceMongoIdInArray } from "@/lib/convertData";

import { sanitizeData } from "@/utils/sanitize";
import { getModule } from "@/queries/modules";
import { ModuleActions } from "./_components/module-action";
import { useGetModule } from "@/app/hooks/useModule";
import { useMemo } from "react";

interface LessonPageProps {
  params: {
    courseId: string;
    moduleId:string;
  };
}
const Module =  ({ params:{courseId, moduleId} }:LessonPageProps) => {
 

  // const Singlemodule = await getModule(moduleId);
  // const sanitizeModule = await sanitizeData(Singlemodule)
   const { data: moduleData, isLoading, error } = useGetModule(moduleId);

  //  const sanitizeModule =  sanitizeData(moduleData)

    const sanitizeModule = useMemo(() => {
    if (!moduleData) return null;
    return sanitizeData(moduleData);
  }, [moduleData]);

  

  const rawlessons = useMemo(() => {
    if (!moduleData?.lessonIds) return [];
    // const sorted = [...moduleData.lessonIds].sort((a, b) => a.order - b.order);
    // return sanitizeData(sorted);
    return replaceMongoIdInArray(moduleData?.lessonIds).sort((a,b) => a.order - b.order);
  }, [moduleData]);
 
  
  //  const rawlessons =  replaceMongoIdInArray(moduleData?.lessonIds).sort((a,b) => a.order - b.order);
  
   const lessons = sanitizeData(rawlessons);
    if (isLoading) return <p>Loading...</p>;
  if (error || !moduleData) return <p>Error loading module</p>;

  return (
    <>
     {!moduleData?.status &&<AlertBanner
        label="This module is unpublished. It will not be visible in the course."
        variant="warning"
      /> } 

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/instructor/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-end">
              <ModuleActions module ={sanitizeModule} courseId = {courseId}  />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize Your module</h2>
              </div>
              <ModuleTitleForm initialData={{title: moduleData?.title }} courseId={courseId} chapterId={moduleId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpenCheck} />
                <h2 className="text-xl">Module Lessons</h2>
              </div>
              <LessonForm initialData={lessons} moduleId={moduleId} courseId ={courseId} /> 
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              {/* <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2> */}
            </div>
            {/* <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Module;
