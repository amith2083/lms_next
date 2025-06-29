import { IModule } from "@/app/interfaces/IModule";
import mongoose, { Schema, Document, Types, Model } from "mongoose";



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
  courseId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonIds: {
    required: false,
    type: [Schema.Types.ObjectId],
    ref: "Lesson",
  },
  order: {
    required: true,
    type: Number,
  },
});

export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", moduleSchema);
