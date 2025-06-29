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
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLesson } from "@/app/hooks/useLesson";

// import { updateLesson } from "@/app/actions/lesson";

const formSchema = z.object({
  description: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;
interface LessonDescriptionFormProps {
  initialData: {
    description: string;
  };
  courseId: string;
  lessonId: string;
}
export const LessonDescriptionForm: React.FC<LessonDescriptionFormProps> = ({
  initialData,
  courseId,
  lessonId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialData?.description);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
const { mutateAsync } = useUpdateLesson(lessonId);
  const onSubmit = async (values: FormValues) => {
    try {
      // await updateLesson(lessonId, values);
      await mutateAsync(values)
      setDescription(values?.description);
      toast.success("Lesson updated");
      toggleEdit();
      // router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{description}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
