"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useUpdateCategory } from "@/app/hooks/useCategories";


const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TitleFormProps {
  initialData: {
    title: string;
  };
  categoryId: string;
}

export const TitleForm: React.FC<TitleFormProps> = ({
  initialData,
  categoryId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
    const { mutateAsync } = useUpdateCategory(categoryId);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // await updateCategory(categoryId, values);
   await mutateAsync({ data: values });
      toggleEdit();
      // router.refresh();
      toast.success("Category has been updated");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Category title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
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
                      placeholder=""
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
