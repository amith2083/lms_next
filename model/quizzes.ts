import { IQuiz } from "@/app/interfaces/IQuizzes";
import mongoose, { Schema, Model } from "mongoose";

const quizzesSchema: Schema<IQuiz> = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  explanations: {
    type: String,
  },
  options: {
    type: Array, 
  },
  mark: {
    required: true,
    default: 5,
    type: Number,
  },
});

// 3. Export the model
export const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizzesSchema);