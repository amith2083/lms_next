 'use client'
 import { Loader2 } from "lucide-react";
import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { QuizSetAction } from "./_components/quiz-set-action";
import { TitleForm } from "./_components/title-form";
import { AddQuizForm } from "./_components/add-quiz-form";
import { cn } from "@/lib/utils";
 
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { Trash } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { Circle } from "lucide-react";
// import { getQuizSetById } from "@/queries/quizzes";
import { QuizCardActions } from "./_components/quiz-card-action";
import { useQuizsetDetails } from "@/app/hooks/useQuiz";


 
const EditQuizSet = ({ params: {quizSetId} }) => {

  // const quizSet = await getQuizSetById(quizSetId);


   const{data:quizSet,isLoading,error}=useQuizsetDetails(quizSetId)
   console.log('quiz',quizSet)
     // While loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-500">Loading quiz set...</span>
      </div>
    );
  }
    // If there's an error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AlertBanner
          label="Failed to load the quiz set. Please try again later."
          variant="error"
        />
      </div>
    );
  }

  const quizzes = quizSet?.quizIds?.map(quiz => {
    return {
      id: quiz._id.toString(),
      title: quiz.title,
      options: quiz.options.map(option => {
        return {
          label: option.text,
          isTrue: option.is_correct,
        }
      })
    }
  })
 // console.log(quizzes);


  // const [quizes, setQuizes] = useState(initialQuizes);
  return (
    <>
    {
      !quizSet?.active && <AlertBanner
      label="This Quiz is unpublished. It will not be visible in the course."
      variant="warning"
    />
    }
      
      <div className="p-6">
        <div className="flex items-center justify-end">
          <QuizSetAction quizSetId={quizSetId} quiz={quizSet?.active} quizId={quizSet?.id} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 mt-16">
          {/* Quiz List */}
          <div className="max-lg:order-2">
            <h2 className="text-xl mb-6">Quiz List</h2>
      {
        quizzes?.length === 0 && (
             <AlertBanner
              label="No Quiz are in the set, add some using the form above."
              variant="warning"
              className="rounded mb-6"
            />
        )
      }    
           
            
            <div className="space-y-6">
              {quizzes.map((quiz) => {
                return (
                  <div
                    key={quiz.id}
                    className=" bg-gray-50 shadow-md p-4 lg:p-6 rounded-md border"
                  >
                    <h2 className="mb-3">{quiz.title}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {quiz.options.map((option) => {
                        return (
                          <div
                            className={cn(
                              "py-1.5 rounded-sm  text-sm flex items-center gap-1 text-gray-600"
                            )}
                            key={option.label}
                          >
                            {option.isTrue ? (
                              <CircleCheck className="size-4 text-emerald-500 " />
                            ) : (
                              <Circle className="size-4" />
                            )}

                            <p>{option.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-6">
       <QuizCardActions quiz={quiz} quizSetId={quizSetId} />     
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/*  */}
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your quiz set</h2>
            </div>
            <div className="max-w-[800px]">
              <TitleForm
                initialData={{ title: quizSet.title  }} quizSetId={quizSetId}
              />
            </div>

            <div className="max-w-[800px]">
              <AddQuizForm quizSetId={quizSetId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditQuizSet;
