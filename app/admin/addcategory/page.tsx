"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createCategory } from "@/app/actions/category";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title is required." }),
  description: z.string().min(3, { message: "Description is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCategory() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    try {
      await createCategory(values);
      toast.success("Category created successfully!");
      form.reset();
      router.push("/admin/categories");
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="max-w-full w-[536px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Web Development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Brief description of this category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex items-center gap-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="black" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
