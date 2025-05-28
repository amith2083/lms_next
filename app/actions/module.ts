"use server";

import { Course } from "@/model/course";
import { create } from "@/queries/modules";
import { IModule, Module } from "@/model/module";


export const createModule = async(data: FormData): Promise<IModule>=> {
    try {
        const title = data.get("title") as string;
        const slug = data.get("slug") as string;
        const courseId = data.get("courseId") as string;
        const order = Number(data.get("order"));

        const res = await create({ title, slug, course: courseId, order })as IModule;;

        const course = await Course.findById(courseId);
        if (!course) throw new Error("Course not found");

        course.modules.push(res._id);
        await course.save();

        return res;

    } catch (e: any) {
        throw new Error(e.message || "An error occurred while creating the module");
    }
}

interface ReorderModuleData {
  id: string;
  position: number;
}
export const reOrderModules=async(data: ReorderModuleData[]): Promise<void> => {

    try {
        await Promise.all(data.map(async(element) => {
            await Module.findByIdAndUpdate(element.id, {order: element.position});
        }));
    } catch (e:any) {
        throw new Error(e.message);
    }

}