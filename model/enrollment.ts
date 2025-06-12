import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define TypeScript interface
export interface IEnrollment extends Document {
  enrollment_date: Date;
  status: string;
  completion_date: Date;
  method: string;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
}

// 2. Define the schema
const enrollmentSchema: Schema<IEnrollment> = new Schema({
  enrollment_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  completion_date: {
    type: Date,
    required: false,
  },
  method: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// 3. Create and export the model
export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
