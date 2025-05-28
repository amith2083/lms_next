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