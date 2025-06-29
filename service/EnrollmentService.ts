
import { IEnrollmentRepository } from '@/app/interfaces/IEnrollmentRepository';
import { IEnrollmentService } from '@/app/interfaces/IEnrollmentService';
import { DocumentWithId } from '@/lib/convertData';
import { Course } from '@/model/course';
import { User } from '@/model/user';

export class EnrollmentService implements IEnrollmentService {
  constructor(private enrollmentRepository: IEnrollmentRepository) {}

  async getEnrollmentsForCourse(courseId: string): Promise<DocumentWithId[]> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    return this.enrollmentRepository.getEnrollmentsForCourse(courseId);
  }

  async getEnrollmentsForUser(userId: string): Promise<DocumentWithId[]> {
    // const user = await User.findById(userId);
    // if (!user) throw new Error('User not found');
   
    return this.enrollmentRepository.getEnrollmentsForUser(userId);
  }

  async enrollForCourse(courseId: string, userId: string, paymentMethod: string): Promise<DocumentWithId> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (!['credit-card', 'paypal', 'stripe'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }
    return this.enrollmentRepository.enrollForCourse(courseId, userId, paymentMethod);
  }
}