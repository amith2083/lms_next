import { NextRequest, NextResponse } from 'next/server';

import { EnrollmentService } from '@/service/EnrollmentService';
import { EnrollmentRepository } from '@/app/respositories/EnrollmentRepository';

const enrollmentRepository = new EnrollmentRepository();
const enrollmentService = new EnrollmentService(enrollmentRepository);

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const enrollments = await enrollmentService.getEnrollmentsForCourse(params.courseId);
    return NextResponse.json(enrollments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch enrollments' }, { status: 500 });
  }
}