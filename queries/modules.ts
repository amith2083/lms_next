import { replaceMongoIdInObject } from "@/lib/convertData"
import { Lesson } from "@/model/lesson"
import { IModule, Module } from "@/model/module"
interface ModuleData{
    title:string,
    slug:string,
    course:string,
    order:number

}

export const create = async(moduleData:ModuleData): Promise<IModule>=>{
    try {
         const createdModule = await Module.create(moduleData)
    return JSON.parse(JSON.stringify(createdModule))
        
    } catch (error:unknown) {
        if (error instanceof Error) {
    throw new Error(error.message)
  } else {
    throw new Error("An unknown error occurred")
  }
        
    }
   
}

export const getModule=async(moduleId:string):Promise<IModule>=>{
    try {
        const moduleWithLesson= await Module.findById(moduleId).
        populate({
            path: "lessonIds",
            model: Lesson
        }).lean();
         return replaceMongoIdInObject(moduleWithLesson);
    } catch (error:any) {
        throw new Error(error.message);
    }
}