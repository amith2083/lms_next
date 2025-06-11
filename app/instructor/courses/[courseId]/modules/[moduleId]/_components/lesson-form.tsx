"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LessonList } from "./lesson-list";
import { LessonModal } from "./lesson-modal";
import { getSlug } from "@/lib/convertData";
import { createLesson, reOrderLesson } from "@/app/actions/lesson";
import { useCreateLesson } from "@/app/hooks/useCreateLesson";
import { useLesson } from "@/app/hooks/useLesson";


interface Lesson {
  id: string;
  title: string;
}

interface LessonFormProps {
  initialData?: Lesson[];
  moduleId: string;
  courseId:string
}
 type FormValues = z.infer<typeof formSchema>;
const formSchema = z.object({
  title: z.string().min(1),
});
interface ReorderData {
  id: string;
  position: number;
}
 
export const LessonForm: React.FC<LessonFormProps> = ({ initialData=[], moduleId,courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(initialData);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { data: foundLesson, isLoading: loadingLesson } = useLesson(selectedLessonId || "");

  const toggleCreating = () => setIsCreating((current) => !current);
  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  useEffect(() => {
  if (foundLesson) {
    setLessonToEdit(foundLesson);
    setIsEditing(true);
  }
}, [foundLesson]);
 const createLesson = useCreateLesson();
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values:FormValues) => {
      try {
      const payload = {
  title: values.title,
  slug: getSlug(values.title),
  moduleId,
  order: lessons.length.toString(),
};
        // const formData = new FormData();
        // formData.append("title", values?.title);
        // formData.append("slug", getSlug(values?.title));
        // formData.append("moduleId",moduleId);
        // formData.append("order", lessons.length.toString())
  
        const lesson = await createLesson.mutateAsync(payload); 
  
        setLessons((lessons) => [
          ...lessons,
          {
            id: lesson?._id.toString(),
            title: values.title,
          },
        ]);
        toast.success("Lesson created");
        toggleCreating();
       
      } catch (error) {
        toast.error("Something went wrong");
      }
    }; 
 
  const onReorder = async (updateData:ReorderData[]) => {
    console.log({ updateData });
    try {
      setIsUpdating(true);
      await reOrderLesson(updateData);
      toast.success("Lesson reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  // const onEdit = (id:string) => {
  //   console.log('id',id)
  //       // const foundLesson = lessons.find(lessons => lessons.id === id);
  //   //     console.log('foundlesson',foundLesson)
  //   // setLessonToEdit(foundLesson||null);
  //   setIsEditing(true);
  // };
  const onEdit = (id: string) => {
  setSelectedLessonId(id); // only update state, don't call hooks here
};

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Module Lessions
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !lessons?.length && "text-slate-500 italic"
          )}
        >
          {!lessons?.length && "No module"}
          <LessonList
            onEdit={onEdit}
            onReorder={onReorder}
            items={lessons || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag & Drop to reorder the modules
        </p>
      )}
      <LessonModal open={isEditing} setOpen={setIsEditing} courseId={courseId} lesson={lessonToEdit} moduleId={moduleId}  onClose={() => {
    if (lessonToEdit) {
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonToEdit.id));
    
    }
  }}  />
    </div>
  );
};
