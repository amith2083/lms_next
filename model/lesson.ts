import mongoose, { Schema, Document, Model, Types } from "mongoose";


export interface ILesson extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  duration: number;
  video_url?: string;
  active: boolean;
  slug: string;
  access: "private" | "public"; // optional: restrict values
  order: number;
}


const lessonSchema: Schema<ILesson> = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  duration: {
    required: true,
    default: 0,
    type: Number,
  },
  video_url: {
    required: false,
    type: String,
  },
  active: {
    required: true,
    default: false,
    type: Boolean,
  },
  slug: {
    required: true,
    type: String,
  },
  access: {
    required: true,
    default: "private",
    type: String,
    enum: ["private", "public"], // optional: enforce allowed values
  },
  order: {
    required: true,
    type: Number,
  },
});


export const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);