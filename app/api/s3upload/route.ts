import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
    try{
  const { fileName, fileType } = await req.json();
     console.log("Incoming S3 upload request:", { fileName, fileType });

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
  }

  const key = `course-videos/${nanoid()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

    console.log("S3 Command created:", command);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
 console.log("Signed URL generated:", signedUrl);
    console.log("Public file URL:", fileUrl);
  return NextResponse.json({ signedUrl, fileUrl,key });
}catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}
