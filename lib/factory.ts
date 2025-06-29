import { CourseRepository } from "@/app/respositories/CourseRepository";
import { CourseService } from "@/service/CourseService";

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);

export { courseService };
