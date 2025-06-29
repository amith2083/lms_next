import { DocumentWithId } from "@/lib/convertData";
import { IQuizset } from "./IQuizset";



export interface IQuizsetRepository {
  getQuizsets(excludeUnpublished: boolean): Promise<DocumentWithId[]>;
  getQuizsetById(id: string): Promise<DocumentWithId | null>;
  createQuizset(data: Partial<IQuizset>): Promise<DocumentWithId>;
  updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<DocumentWithId | null>;
  addQuizToQuizset(quizsetId: string, quizData: any): Promise<void>;
  deleteQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;
  changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
  deleteQuizset(quizsetId: string): Promise<void>;
    createQuiz(data: any): Promise<string>;
}