import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { updateCourse } from "@/app/actions/course";

const pump = promisify(pipeline);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("files") as File | null;
    const destination = formData.get("destination") as string | null;
    const courseId = formData.get("courseId") as string | null;

    if (!file || !(file instanceof File)) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    if (!destination) {
      return new NextResponse("Destination not provided", { status: 400 });
    }

    if (!courseId) {
      return new NextResponse("Course ID not provided", { status: 400 });
    }

    // Ensure directory exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const filePath = `${destination}/${file.name}`;
    const writeStream = fs.createWriteStream(filePath);

    // Save file stream
    await pump(file.stream(), writeStream);

    // Update course record with the filename
    await updateCourse(courseId, { thumbnail: file.name });

    return new NextResponse(`File ${file.name} uploaded successfully`, {
      status: 200,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return new NextResponse(message, { status: 500 });
  }
}
