import { Document, Types } from 'mongoose';

// Interface for the Quizset document (without Mongoose-specific methods)
export interface IQuizset {
  title: string;
  description?: string;
  slug?: string;
  quizIds?: Types.ObjectId[];
  active: boolean;
}

// Interface for the Quizset document with Mongoose Document methods
export interface IQuizsetDocument extends IQuizset, Document {}