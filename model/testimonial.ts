import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define the interface
export interface ITestimonial extends Document {
  content: string;
  rating: number;
  courseId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

// 2. Define the schema
const testimonialSchema: Schema<ITestimonial> = new Schema({
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// 3. Export the model
export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", testimonialSchema);





// import mongoose,{Schema} from "mongoose";

// const testimonialSchema = new Schema({ 
//     content:{
//         required: true,
//         type: String
//     },    
//     rating:{
//         required: true,
//         type: Number
//     },   
//     courseId:{  type: Schema.ObjectId, ref: "Course" },

//     user:{  type: Schema.ObjectId, ref: "User" },
 
// });
// export const Testimonial = mongoose.models.Testimonial ?? mongoose.model("Testimonial",testimonialSchema);