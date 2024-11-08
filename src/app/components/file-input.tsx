"use client";

import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { UploadButton } from "@/app/components/upload-button";
import { api } from "@/trpc/react";

const MAX_SIZE_IN_MB = 2;

interface FileWrapper {
  file: File;
  url: string;
  base64: string;
}

export function FileInput() {
  const [fileWrapper, setFileWrapper] = useState<FileWrapper | null>(null);
  const utils = api.useUtils();

  const createImageScore = api.imageScores.create.useMutation({
    onSuccess: async () => {
      await utils.imageScores.invalidate();
      setFileWrapper(null);
    },
  });

  const handleUpload = () => {
    createImageScore.mutate({
      file_name: fileWrapper?.file.name ?? "",
      file_type: fileWrapper?.file.type ?? "",
      file_data: fileWrapper?.base64 ?? "",
    });
  };

  const handleSelectFile = (file: File) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const imageUrl = URL.createObjectURL(file);

      setFileWrapper({
        file,
        url: imageUrl,
        base64: reader.result as string,
      });
    };
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((fileRejection) => {
      toast.error(
        `${fileRejection.file.name} was rejected: ${fileRejection.errors
          .map((e) => {
            if (e.code === "file-too-large") {
              return `File is larger than ${MAX_SIZE_IN_MB}MB`;
            }

            return e.message;
          })
          .join(", ")}.`,
      );
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    handleSelectFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_SIZE_IN_MB * 1024 * 1024,
  });

  return (
    <div className="mb-32 flex flex-col items-center justify-center gap-2 md:mb-0 md:min-h-[50vh]">
      <div
        {...getRootProps()}
        className="hover:bg-foreground/[2.5%] cursor-pointer rounded-md border border-dashed p-4 text-center text-xl font-semibold"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="font-second">Drop a file here...</p>
        ) : (
          <p className="font-second">
            Drag &apos;n&apos; drop a file here, or click to select one
          </p>
        )}
        <span className="text-foreground/80 font-second text-xs">
          PNG, JPG or WEBP (Max. 2MB).
        </span>

        {fileWrapper && (
          <img
            width={192}
            height={192}
            src={fileWrapper.url}
            className="mx-auto mt-4 object-cover"
            onLoad={() => {
              URL.revokeObjectURL(fileWrapper.url);
            }}
          />
        )}
      </div>

      {fileWrapper && (
        <UploadButton
          onClick={handleUpload}
          isLoading={createImageScore.isPending}
        />
      )}
    </div>
  );
}
