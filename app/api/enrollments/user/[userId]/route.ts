import { NextRequest, NextResponse } from 'next/server';

import { EnrollmentService } from '@/service/EnrollmentService';
import { EnrollmentRepository } from '@/app/respositories/EnrollmentRepository';

const enrollmentRepository = new EnrollmentRepository();
const enrollmentService = new EnrollmentService(enrollmentRepository);

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    
    const enrollments = await enrollmentService.getEnrollmentsForUser(params.userId);
    console.log('getenrollement',enrollments)
    return NextResponse.json(enrollments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { courseId, paymentMethod } = await req.json();
    const enrollment = await enrollmentService.enrollForCourse(courseId, params.userId, paymentMethod);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to enroll in course' },
      { status: error.message.includes('already enrolled') ? 409 : 500 }
    );
  }
}