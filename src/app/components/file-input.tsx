"use client";

import { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { UploadButton } from "@/app/components/upload-button";
import { api } from "@/trpc/react";
import { UploadModal } from "./uploadModal";
import { scoresInfo } from "@/types/score-info";
import { scoreIndex } from "@/utils/scoreIndex";

const MAX_SIZE_IN_MB = 2;

const loadingMessages: string[] = [
  "Just a sec, the AI is working its wizardry...",
  "AI's thinking... be right back with your score! 🤔⚡",
  "Fetching your score... hold on, the AI is on it! 🤖💡",
  "Hang tight... AI magic in progress! 🪄💻",
  "AI’s busy doing its thing... please wait! ⚙️🤖",
];

interface FileWrapper {
  file: File;
  url: string;
  base64: string;
}

interface ImageInfo {
  file_name: string,
  file_type: string,
  file_data: string,
  score: number,
  reason: string,
  user_name: string | null,
}

export function FileInput() {
  const [fileWrapper, setFileWrapper] = useState<FileWrapper | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [succeedUploadImage, setSucceedUploadImage] = useState<ImageInfo | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const utils = api.useUtils();

  const createImageScore = api.imageScores.create.useMutation({
    onSuccess: async (data) => {
      setLoading(true);
      setSucceedUploadImage(data);
      setOpenModal(true);
      setLoading(false);
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

  useEffect(() => {
    if (loading) {
      let index = 0;
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[index] ?? "loading...");
        index = (index + 1) % loadingMessages.length;
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div className="mb-32 flex flex-col items-center justify-center gap-2 md:mb-0 md:min-h-[50vh]">
      <div
        {...getRootProps()}
        className="w-4/5 cursor-pointer rounded-md border border-dashed border-border p-4 text-center text-xl font-semibold hover:bg-foreground/[2.5%]"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="font-second">Drop a file here...</p>
        ) : (
          <p className="font-second">
            Drag &apos;n&apos; drop a file here, or click to select one
          </p>
        )}
        <span className="font-second text-xs text-foreground/80">
          PNG, JPG or WEBP (Max. 2MB).
        </span>

        {fileWrapper && (
          <img
            width={192}
            height={192}
            src={fileWrapper.url}
            className="mx-auto mt-4 object-cover"
            // onLoad={() => {
            //   URL.revokeObjectURL(fileWrapper.url);
            // }}
          />
        )}
      </div>

      {fileWrapper && (
        <UploadButton
          onClick={handleUpload}
          //isLoading={createImageScore.isPending}
          isLoading={loading}
        />
      )}
      {loading && loadingMessage && (
        <p className="font-second text-sm text-foreground">{loadingMessage}</p>
      )}

      {openModal && (
        <UploadModal
          image={fileWrapper?.url ?? ""}
          score={succeedUploadImage?.score ?? 0}
          emoji={scoresInfo[scoreIndex(succeedUploadImage?.score ?? 0)]?.emoji ?? ""}
          scoreDescription={scoresInfo[scoreIndex(succeedUploadImage?.score ?? 0)]?.description ?? ""}
          imageDescription={succeedUploadImage?.reason ?? ""}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
