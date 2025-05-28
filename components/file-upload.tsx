"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type UploadDropzoneProps = {
  isMulti?: boolean;
  label?: string;
  onUpload: (files: File[]) => void;
};

export const UploadDropzone = ({
  isMulti = false,
  label,
  onUpload,
}: UploadDropzoneProps) => {
  const [droppedFiles, setDroppedFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulated upload progress (visual only)
  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (isUploading) return;

      setIsUploading(true);
      const progressInterval = startSimulatedProgress();
      setDroppedFiles(acceptedFiles);

      // Simulate async upload (you can replace this with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearInterval(progressInterval);
      setUploadProgress(100);
      onUpload(acceptedFiles);
      setTimeout(() => setIsUploading(false), 500); // Reset state after brief pause
    },
    [isUploading, onUpload]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: isMulti,
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const errorMessages = fileRejections
        .flatMap((rejection) => rejection.errors.map((e) => e.message))
        .join(", ");
      toast.error(`File upload error: ${errorMessages}`);
    }
  }, [fileRejections]);

  return (
    <div>
      {label && <p className="text-sm mb-2 font-medium text-gray-700">{label}</p>}

      <div
        {...getRootProps()}
        className={cn(
          "mt-3 flex cursor-pointer items-center justify-center rounded-md border border-dashed p-3 py-12 hover:bg-muted/30",
          isUploading ? "pointer-events-none !cursor-not-allowed opacity-80" : ""
        )}
      >
        <input multiple={isMulti} {...getInputProps()} disabled={isUploading} />

        <div className="flex flex-col items-center gap-3 text-center text-[#858585]">
          <CloudUpload size={48} className="text-gray-600" />
          <h4 className="font-normal text-[#858585]">
            <span className="font-semibold text-black underline">
              Click to upload
            </span>{" "}
            or drag and drop <br />
            Maximum file size 50 MB.
          </h4>

          {isUploading && (
            <div className="mx-auto mt-4 w-full max-w-xs">
              <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
            </div>
          )}
        </div>
      </div>

      {/* Show uploaded file names */}
      {droppedFiles && (
        <ul className="mt-4 list-disc pl-5 text-sm text-gray-500">
          {droppedFiles.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
