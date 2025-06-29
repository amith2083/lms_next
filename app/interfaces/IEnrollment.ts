import { Document, Types } from 'mongoose';
import { DocumentWithId } from '@/lib/convertData';

export interface IEnrollment extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  method: string;
  enrollment_date: Date;
  status: 'not-started' | 'in-progress' | 'completed';
}