
import { Course } from "@/model/course";
import { create } from "@/queries/modules";
import { IModule, Module } from "@/model/module";
interface CreateModuleInput {
  title: string;
  slug: string;
  courseId: string;
  order: number;
}
export const createModule = async (data: CreateModuleInput): Promise<IModule> => {
  try {
    const { title, slug, courseId, order } = data;
    // const title = data.get("title") as string;
    // const slug = data.get("slug") as string;
    // const courseId = data.get("courseId") as string;
    // const order = Number(data.get("order"));

    const res = (await create({
      title,
      slug,
      course: courseId,
      order,
    })) as IModule;

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    course.modules.push(res._id);
    await course.save();

    return res;
  } catch (e) {
   if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson creation");
    }
  }
};

export const updateModule = async (
  moduleId: string,
  data: Partial<{ title: string; description: string;  }>
) => {
    
  try {
    const updatedModule = await Module.findByIdAndUpdate(moduleId, data, {
      new: true,
    });
    console.log('update',updateModule)
    return updatedModule;
  } catch (error: any) {
    throw new Error("Failed to update module: " + error.message);
  }
};

export const changemodulePublishState = async (
  moduleId: string
): Promise<boolean> => {
  const module = await Module.findById(moduleId);
  if (!module) throw new Error("module not found");

  module.status = !module.status;
  await module.save();
  return module.status;
};

export const deleteModule = async (
  moduleId: string,
  courseId: string
): Promise<void> => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Remove module from course
  course.modules = course.modules.filter((id) => id.toString() !== moduleId);

  // Delete module
  const deleted = await Module.findByIdAndDelete(moduleId);
  if (!deleted) {
    throw new Error("Module not found or failed to delete");
  }

  // Save course
  await course.save();
};


// export const deleteModule = async (moduleId: string): Promise<void> => {
//   const deleted = await Module.findByIdAndDelete(moduleId);
//   if (!deleted) throw new Error("Module not found or failed to delete");
// };
