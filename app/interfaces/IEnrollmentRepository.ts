import { DocumentWithId } from '@/lib/convertData';

export interface IEnrollmentRepository {
  getEnrollmentsForCourse(courseId: string): Promise<DocumentWithId[]>;
  getEnrollmentsForUser(userId: string): Promise<DocumentWithId[]>;
  enrollForCourse(courseId: string, userId: string, paymentMethod: string): Promise<DocumentWithId>;
}