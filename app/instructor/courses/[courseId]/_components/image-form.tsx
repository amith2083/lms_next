"use client";

import { useEffect, useState } from "react";

// import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import * as z from "zod";
 
import { UploadDropzone } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUpdateCourseImage } from "@/app/hooks/useCourse";


const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});
type FormValues = z.infer<typeof formSchema>;

export const ImageForm = ({ initialData, courseId }) => {

  const [file, setFile] = useState(null);

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
    const updateCourseImage = useUpdateCourseImage(courseId);

  useEffect(() => {
    if (file) {
      async function uploadFile(){
        try {
          const formData = new FormData();
          formData.append("files", file[0]);
          formData.append("destination", "./public/assets/images/courses");
          formData.append("courseId",courseId);
          await updateCourseImage.mutateAsync(formData);

          toast.success("Image updated!");
          toggleEdit()

        } catch (e) {
           toast.error(e.message);
        }
      }
      uploadFile();
    }

  },[file]);





  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values:FormValues) => {
    try {
      toast.success("Course updated");
      toggleEdit();
      // router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <UploadDropzone onUpload={(file) => setFile(file)} />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};