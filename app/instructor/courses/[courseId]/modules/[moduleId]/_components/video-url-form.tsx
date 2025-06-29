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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { VideoPlayer } from "@/components/video-player";
import { formatDuration } from "@/lib/duration";
import { useUpdateLesson } from "@/app/hooks/useLesson";


type FormValues = z.infer<typeof formSchema>;
const formSchema = z.object({
  // url: z.string().min(1, {
  //   message: "Required",
  // }),
  url: z.any().refine((file) => file instanceof File, { message: "Required" }),
  duration: z.string().min(1, {
    message: "Required",
  }),
});
interface VideoUrlFormProps {
  initialData: {
    url: string;
    duration: number;
  };
  courseId: string;
  lessonId: string;
}

export const VideoUrlForm: React.FC<VideoUrlFormProps>  = ({ initialData, courseId, lessonId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
    const [state, setState] = useState({
    url: initialData?.url,
    duration: formatDuration(initialData?.duration)??"",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: state,
  });

  const { isSubmitting, isValid } = form.formState;
const { mutateAsync } = useUpdateLesson(lessonId);
  const onSubmit = async (values:FormValues) => {
  
    try {
      const file = values.url as File;
          console.log("Selected file:", file);
     const durationParts = values.duration.split(":").map(Number);
      if (durationParts.length === 3) {
        const [hours, minutes, seconds] = durationParts;
        const totalDuration = hours * 3600 + minutes * 60 + seconds;
            console.log("Duration in seconds:", totalDuration);
         // 1. Get signed URL
    const res = await fetch("/api/s3upload", {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { signedUrl, fileUrl,key } = await res.json();
     console.log("Signed URL:", signedUrl);
        console.log("File URL:", fileUrl);

    // 2. Upload file directly to S3
   const uploadRes= await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  console.log("S3 Upload response:", uploadRes.status);
        const payload = {
          video_url: key,
          duration: totalDuration,
        };
        // await updateLesson(lessonId,payload)
        // Update local state so UI reflects the change
        await mutateAsync(payload)
      setState({
        url: key,
        duration: values.duration,
      });
        toast.success("Lesson updated");
        toggleEdit();
      // router.refresh()
    }
   } catch {
     console.error("Error in onSubmit:", err)
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video URL
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit URL
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className="text-sm mt-2">
            {state?.url}
          </p>
          <div className="mt-6">
            <VideoPlayer  videoKey={state?.url} />
          </div>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* url */}
            <FormField
  control={form.control}
  name="url"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Upload Video</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => field.onChange(e.target.files?.[0])}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
            {/* duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Duration</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '10:30:18'"
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
