"use server"

import { ILesson, Lesson } from "@/model/lesson";
import { Module } from "@/model/module";
import { create } from "@/queries/lesson";

 


export const createLesson= async(data: FormData):Promise<ILesson>=>{
    try {
        const title = data.get("title") as string;
        const slug = data.get("slug") as string;
        const moduleId = data.get("moduleId");
        const order = Number(data.get("order"));

        const createdLesson = await create({title,slug,order});

        const moduleWithLesson = await Module.findById(moduleId);
           if (!moduleWithLesson) {
            throw new Error("Module not found");
           }
        moduleWithLesson.lessonIds.push(createdLesson._id);
        moduleWithLesson.save();

        return createdLesson;
        
    } catch (e) {
        if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson creation");
    }
    }
}



interface ReorderLessonData {
  id: string;
  position: number;
}


export const reOrderLesson = async (data: ReorderLessonData[]): Promise<void> => {
  try {
    await Promise.all(
      data.map(async (element) => {
        await Lesson.findByIdAndUpdate(element.id, { order: element.position });
      })
    );
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson reordering");
    }
  }
};



export const updateLesson = async (
  lessonId: string,
  data: string | Record<string, any>
): Promise<void> => {
    try {
         console.log("Updating lesson ID:", lessonId);
    console.log("Update data:", data);
        await Lesson.findByIdAndUpdate(lessonId,data);
    } catch (e) {
        if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson reordering");
    }
        
    }
}