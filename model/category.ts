import { ICategory } from "@/app/interfaces/ICategory";
import mongoose, { Document, Schema } from "mongoose";
import { boolean } from "zod";





const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
   status: {
    type: Boolean,
    required: false,
    default:true
  },
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   thumbnail: {
//     type: String,
//     required: false,
//   },
//   status: {
//     type: Boolean,
//     required: false,
//     default: true,
//   },
// });

// export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

