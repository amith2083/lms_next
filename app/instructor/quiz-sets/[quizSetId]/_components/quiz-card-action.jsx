"use client"
import React, { useState } from 'react';
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { Trash } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDeleteQuizFromQuizset } from '@/app/hooks/useQuiz';
// import { deleteQuiz } from '@/app/actions/quiz';

export const QuizCardActions = ({quiz,quizSetId}) => {

    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const deleteMutation = useDeleteQuizFromQuizset(quizSetId, quiz.id);

// async function handleSubmit(event) {
//     event.preventDefault();
//     try {
//         setLoading(true);

//     switch (action) {
//         case "edit-quiz": {
//             console.log(`Edting quiz: ${quiz.id} in quiz set: ${quizSetId} `)
//             break;
//         }
//         case "delete-quiz": {

//             // await deleteQuiz(quizSetId, quiz.id);
//             toast.success("Quiz has been deleted");
//             router.refresh();
//             break; 
//         } 
//         default:{
//             throw new Error("Invalid Action");
//         }    
//      } 
//     } catch (e) {
//         toast.error(`Error: ${e.message}`);
//     }finally {
//         setLoading(false);
//     } 
// }
const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMutation.mutateAsync();
      toast.success("Quiz has been deleted");
 
    } catch (e) {
      toast.error("Failed to delete quiz");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="flex gap-2">
      <Button
        className="text-destructive"
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash className="w-3 mr-1" /> 
      </Button>
    </div>
    );
};

 