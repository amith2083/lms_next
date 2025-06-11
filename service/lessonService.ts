import { ILesson, Lesson } from "@/model/lesson";
import { Module } from "@/model/module";
import { create } from "@/queries/lesson";
interface CreateLessonInput {
  title: string;
  slug: string;
  moduleId: string;
  order: number;
}
export const createLesson= async(data:CreateLessonInput):Promise<ILesson>=>{
    try {
        const { title, slug, moduleId, order } = data;
        // const title = data.get("title") as string;
        // const slug = data.get("slug") as string;
        // const moduleId = data.get("moduleId");
        // const order = Number(data.get("order"));

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

export const updateLesson = async (
  lessonId: string,
  data: string | Record<string, any>
): Promise<void> => {
    try {
         console.log("Updating lesson ID:", lessonId);
    console.log("Update data:", data);
       const updatedLesson= await Lesson.findByIdAndUpdate(lessonId,data,{new:true});
       return updatedLesson
    } catch (e) {
        if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson reordering");
    }
        
    }
}

export const changeLessonPublishState = async (lessonId: string): Promise<boolean> => {
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const updated = await Lesson.findByIdAndUpdate(
      lessonId,
      { active: !lesson.active },
      { new: true, lean: true }
    );

    if (!updated) throw new Error("Failed to update lesson");

    return updated.active;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during changing publish state");
    }
  }
};

export const deleteLesson = async (
  lessonId: string,
  moduleId: string
): Promise<void> => {
  try {
    const module = await Module.findById(moduleId);
    if (!module) throw new Error("Module not found");

    // module.lessonIds.pull(new Mongoose.Types.ObjectId(lessonId));
    module.lessonIds = module.lessonIds.filter(
  (id) => id.toString() !== lessonId
);
    await Lesson.findByIdAndDelete(lessonId);
    await module.save();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred during lesson deletion");
    }
  }
};