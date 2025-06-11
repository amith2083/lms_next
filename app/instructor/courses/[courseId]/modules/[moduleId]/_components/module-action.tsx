"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changeLessonPublishState, deleteLesson } from "@/app/actions/lesson";
import { toast } from "sonner";
// import { changeModulePublishState, deleteModule } from "@/app/actions/module";
import { useRouter } from "next/navigation";
import { useToggleModulePublish } from "@/app/hooks/useToggleModulePublish";
import { useDeleteModule } from "@/app/hooks/useDeleteModule";



interface Module {
  id: string;
  status: boolean;
}

interface ModuleActionsProps {
  module: Module;
  courseId: string;
 
}

export const ModuleActions: React.FC<ModuleActionsProps> = ({
 module,
  courseId,
  
}) => {
    const router = useRouter()
  const [published, setPublished] = useState<boolean>(module?.status);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleMutation = useToggleModulePublish(module.id);
  const deleteMutation = useDeleteModule(module.id, courseId);

  const handleTogglePublish = async () => {
    setLoading(true);
    try {
      // const newState = await changeModulePublishState(module.id);
      // setPublished(newState);
       const newStatus = await toggleMutation.mutateAsync();
      setPublished(newStatus);
      toast.success("The Module has been updated");
     

     
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (published) {
      toast.error(
        "A published Module cannot be deleted. First unpublish it, then delete."
      );
      return;
    }

    setLoading(true);
    try {
      // await deleteModule(module.id, courseId);
      await deleteMutation.mutateAsync()
     ;
         toast.success("The Module has been deleted");
         router.push(`/instructor/courses/${courseId}`)
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTogglePublish}
        disabled={loading}
      >
        {published ? "Unpublish" : "Publish"}
      </Button>

      <Button size="sm" onClick={handleDelete} disabled={loading}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
