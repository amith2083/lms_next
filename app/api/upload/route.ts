export const runtime = "nodejs"; // ✅ ADD THIS
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
// import { updateCourse } from "@/app/actions/course";
import { updateCategory } from "@/app/actions/category"; 
import { updateCourse } from "@/service/courseService";

const pump = promisify(pipeline);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("files") as File | null;
    const destination = formData.get("destination") as string | null;
    const courseId = formData.get("courseId") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    

    if (!file || !(file instanceof File)) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    if (!destination) {
      return new NextResponse("Destination not provided", { status: 400 });
    }

    if (!courseId && !categoryId) {
      return new NextResponse("No valid ID (course/category) provided", {
        status: 400,
      });
    }
    console.log("File info:", file.name, file.type);
console.log("Destination:", destination);
console.log("courseId:", courseId);
console.log("categoryId:", categoryId);
console.log("File stream:", typeof file.stream);

    // Ensure directory exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const filePath = `${destination}/${file.name}`;
    const writeStream = fs.createWriteStream(filePath);

    // Save file stream
    await pump(file.stream(), writeStream);

    // Update DB record with the filename
    if (courseId) {
      await updateCourse(courseId, { thumbnail: file.name });
    } else if (categoryId) {
      await updateCategory(categoryId, { thumbnail: file.name });
    }

    return new NextResponse(`File ${file.name} uploaded successfully`, {
      status: 200,
    });
  } catch (err: unknown) {
   console.error("Upload error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return new NextResponse(message, { status: 500 });
  }
}
