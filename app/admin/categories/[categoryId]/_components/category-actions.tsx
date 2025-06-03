"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changeCategoryPublishState, deleteCategory } from "@/app/actions/category";


interface CategoryActionsProps {
  categoryId: string;
  status: boolean;
}

export  const CategoryActions: React.FC<CategoryActionsProps> = ({ categoryId, status = false }) => {
  const [action, setAction] = useState<"change-active" | "delete" | null>(null);
  const [published, setPublished] = useState<boolean>(status);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      switch (action) {
        case "change-active": {
          const activeState = await changeCategoryPublishState(categoryId);
          setPublished(activeState);
          toast.success("The category has been updated");
          router.refresh();
          break;
        }

        case "delete": {
          if (published) {
            toast.error("A published category cannot be deleted. First unpublish it, then delete.");
          } else {
            await deleteCategory(categoryId);
            toast.success("The category has been deleted successfully");
            router.push("/admin/categories");
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
          onClick={() => setAction("change-active")}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button
          size="sm"
          type="submit"
          onClick={() => setAction("delete")}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
