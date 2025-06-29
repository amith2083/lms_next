import { IQuizsetDocument } from '@/app/interfaces/IQuizset';
import mongoose, { Schema, model, models } from 'mongoose';


const quizsetSchema = new Schema<IQuizsetDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  quizIds: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Prevent model recompilation in development (e.g., during hot reload)
export const Quizset = (mongoose.models.Quizset as mongoose.Model<IQuizsetDocument>) ?? model<IQuizsetDocument>('Quizset', quizsetSchema);