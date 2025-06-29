'use client'
// import { getAllQuizSets } from "@/queries/quizzes";
import { useGetQuizsets } from "@/app/hooks/useQuiz";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

 
const QuizSets = () => {

  // const quizSetsall = await getAllQuizSets();
  const{data:quizSetsall,isLoading,error}= useGetQuizsets()
  console.log('quizall',quizSetsall)
    if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading quiz sets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load quiz sets. Please try again later.
      </div>
    );
  }

  if (!quizSetsall || quizSetsall.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No quiz sets found.
      </div>
    );
  }
  const mappedQuizSets = quizSetsall.map(q => {
    return {
    id: q.id,
    title: q.title,
    isPublished: q.active,
    totalQuiz: q.quizIds.length,
    }
  })
 
  //console.log(mappedQuizSets);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={mappedQuizSets} />
    </div>
  );
};

export default QuizSets;
