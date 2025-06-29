"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteCourse, useToggleCoursePublish } from "@/app/hooks/useCourse";
// import { changeCoursePublishState, deleteCourse } from "@/app/actions/course";

interface CourseActionsProps {
  courseId: string;
  status: boolean;
}

export const CourseActions: React.FC<CourseActionsProps> = ({ courseId, status }) => {
  const [action, setAction] = useState<"change-active" | "delete" | null>(null);
  const [published, setPublished] = useState<boolean>(status);
  const router = useRouter();
   const toggleMutation = useToggleCoursePublish(courseId);
  const deleteMutation = useDeleteCourse(courseId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      switch (action) {
        case "change-active": {
          await toggleMutation.mutateAsync();
        setPublished((prev) => !prev);
          toast.success("The course has been updated");
         
          break;
        }

        case "delete": {
          if (published) {
            toast.error("A published course cannot be deleted. First unpublish it, then delete.");
          } else {
              await deleteMutation.mutateAsync();
            toast.success("The course has been deleted successfully");
            router.push("/instructor/courses");
          }
          break;
        }

        default:
          throw new Error("Invalid course action");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          type="submit"
          onClick={() => setAction("change-active")}     disabled={toggleMutation.isPending}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button
          size="sm"
          type="submit"
          onClick={() => setAction("delete")}    disabled={deleteMutation.isPending}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
