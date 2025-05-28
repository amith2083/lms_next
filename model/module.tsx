import mongoose, { Schema, Document, Types, Model } from "mongoose";


// 1. Define the TypeScript interface for the document
export interface IModule extends Document {
    _id: Types.ObjectId;
  title: string;
  description?: string;
  status: boolean;
  slug: string;
  course: Types.ObjectId;
  lessonIds: Types.ObjectId[];
  order: number;
}

// 2. Define the schema using Mongoose
const moduleSchema = new Schema<IModule>({
  title: {
    required: true,
    type: String,
  },
   description: {
    type: String,
    required: false, 
    default: "",     
  },
  status: {
    type: Boolean,
    required: false, 
    default: false,  
  },
  slug: {
    required: true,
    type: String,
  },
  course: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonIds: {
    required: true,
    type: [Schema.Types.ObjectId],
    ref: "Lesson",
  },
  order: {
    required: true,
    type: Number,
  },
});

// 3. Create and export the model with types
export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", moduleSchema);
