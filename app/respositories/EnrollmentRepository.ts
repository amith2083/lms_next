import { Enrollment } from '@/model/enrollment';
import { Course } from '@/model/course';

import { DocumentWithId, replaceMongoIdInArray, replaceMongoIdInObject, } from '@/lib/convertData';
import { IEnrollmentRepository } from '../interfaces/IEnrollmentRepository';
import mongoose from 'mongoose';

export class EnrollmentRepository implements IEnrollmentRepository {
  async getEnrollmentsForCourse(courseId: string): Promise<DocumentWithId[]> {
    const enrollments = await Enrollment.find({ course: courseId }).lean();
    return replaceMongoIdInArray(enrollments);
  }

  async getEnrollmentsForUser(userId: string): Promise<DocumentWithId[]> {
   
    
    const enrollments = await Enrollment.find({ student: new mongoose.Types.ObjectId(userId)  })
      .populate({ path: 'course', model: Course })
      .lean();
    return replaceMongoIdInArray(enrollments);
  }

  async enrollForCourse(courseId: string, userId: string, paymentMethod: string): Promise<DocumentWithId> {
    const existingEnrollment = await Enrollment.findOne({ course: courseId, student: userId });
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course.');
    }
    const newEnrollment = await Enrollment.create({
      course: courseId,
      student: userId,
      method: paymentMethod,
      enrollment_date: Date.now(),
      status: 'not-started',
    });
    return replaceMongoIdInObject(newEnrollment.toObject());
  }
}