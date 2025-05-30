import { replaceMongoIdInObject } from "@/lib/convertData";
import { ILesson, Lesson } from "@/model/lesson";


export const getLesson= async(lessonId:string)=>{
    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) {
  throw new Error("Lesson not found");
}
    return replaceMongoIdInObject(lesson);
}

interface CreateLessonInput {
  title: string;
  slug: string;
  order: number;
}

export const create =async(lessonData: CreateLessonInput): Promise<ILesson>=> {
    try {
        const lesson = await Lesson.create(lessonData);
        return JSON.parse(JSON.stringify(lesson));
    } catch (error) {
        if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred during lesson creation");
    }
    }
}