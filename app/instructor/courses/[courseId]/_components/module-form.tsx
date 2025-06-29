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
import { useState } from "react";
import { toast } from "sonner";
import { ModuleList } from "./module-list-form";
// import {  reOrderModules } from "@/app/actions/module";
import { getSlug } from "@/lib/convertData";
import { useCreateModule } from "@/app/hooks/useModule";
;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type FormValues = z.infer<typeof formSchema>;

type Module = {
  id: string;
  title: string;
  status?: boolean;
  order:number
};

type ModulesFormProps = {
  initialData?: Module[];// Replace with a proper type if available
  courseId: string;
};



export const ModulesForm: React.FC<ModulesFormProps> = ({
  initialData = [],
  courseId,
}) => {
 const [modules, setModules] = useState<Module[]>(initialData ?? []);
 
 // Find highest existing order
    const lastOrder = modules.length
      ? Math.max(...modules.map((mod) => mod.order ?? 0))
      : -1;

    const nextOrder = lastOrder + 1;


  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const toggleCreating = (): void =>
    setIsCreating((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

 const createModule = useCreateModule();
   const onSubmit = async (values:FormValues):Promise<void> => {
    try {

      const payload = {
  title: values.title,
  slug: getSlug(values.title),
  courseId,
  order: nextOrder.toString(),
};
      // const formData = new FormData();
      // formData.append("title", values?.title);
      // formData.append("slug", getSlug(values?.title));
      // formData.append("courseId",courseId);
      // // formData.append("order", modules.length.toString())
      //  formData.append("order", nextOrder.toString());

      const moduleCreated = await createModule.mutateAsync(payload); 

      setModules((modules) => [
        ...modules,
        {
         id: moduleCreated._id.toString(),
          title: moduleCreated.title,
            order: nextOrder,
        },
      ]);
      toast.success("Module created");
      toggleCreating();
      
    } catch (error:any) {
      toast.error(error?.message);
    }
  };

  // const onReorder = async (updateData: any): Promise<void> => {
  //   console.log({ updateData });
  //   try {
  //     reOrderModules(updateData)
  //     setIsUpdating(true);
  //     toast.success("Chapters reordered");
  //     router.refresh();
  //   } catch {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const onEdit = (id: string): void => {
    router.push(`/instructor/courses/${courseId}/modules/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Modules
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a module
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
            !modules?.length && "text-slate-500 italic"
          )}
        >
          {!modules?.length && "No module"}
          <ModuleList
            onEdit={onEdit}
            // onReorder={onReorder}
            items={modules}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag & Drop to reorder the modules
        </p>
      )}
    </div>
  );
};
