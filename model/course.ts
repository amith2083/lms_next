import { ICourse } from "@/app/interfaces/ICourse";
import mongoose, { Document, Schema, Types } from "mongoose";



// Define the schema
const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  modules: {
    type: [Schema.Types.ObjectId],
    ref: "Module",
    default: [],
  },
  price: {
    type: Number,
    required: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
   isApproved: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
    required: false,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testimonials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Testimonial",
    },
  ],
  quizSet: {
    type: Schema.Types.ObjectId,
    ref: "Quizset",
    required: false,
  },
  learning: {
    type: [String],
    required: false,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modifiedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Export the model
export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);
