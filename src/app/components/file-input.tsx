"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { Button } from "@/app/components/button";
import { api } from "@/trpc/react";
import { UploadModal } from "@/app/components/upload-modal";
import { scoresInfo } from "@/types/score-info";
import { scoreIndex } from "@/utils/scoreIndex";
import { type ImageScore } from "@prisma/client";

const MAX_SIZE_IN_MB = 2;

const loadingMessages: string[] = [
  "Just a sec, the AI is working its wizardry... 🪄✨",
  "AI's thinking... be right back with your score! 🤔⚡",
  "Fetching your score... hold on, the AI is on it! 🤖💡",
  "Hang tight... AI magic in progress! 🪄💻",
  "AI's busy doing its thing... please wait! ⚙️🤖",
  "Almost done... AI's putting on the finishing touches! 🎨✨",
  "Processing your score... AI's working its magic! 🌟🔮",
  "AI's analyzing your image... won't be long now! 📊🤖",
  "The AI is deep in thought... results coming soon! 🧠💫",
  "Just a moment more... AI's finalizing your score! 🎯✨",
];

interface FileWrapper {
  file: File;
  url: string;
  base64: string;
}

export function FileInput() {
  const [fileWrapper, setFileWrapper] = useState<FileWrapper | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdImageScore, setCreatedImageScore] = useState<ImageScore | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [jobId, setJobId] = useState<string | null>(null);
  const utils = api.useUtils();
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (jobId) {
      interval.current = setInterval(() => {
        getJob.mutate({ jobId });
      }, 5000);
    }
  }, [jobId]);

  const getJob = api.imageScores.getJob.useMutation({
    onSuccess: async (data) => {
      if (data.job?.returnvalue) {
        await utils.imageScores.getAll.invalidate();

        setLoading(false);
        setCreatedImageScore(data.job?.returnvalue as ImageScore);

        if (interval.current) {
          clearInterval(interval.current);
        }
      }
    },
  });

  const createImageScore = api.imageScores.create.useMutation({
    onSuccess: async (data) => {
      setJobId(data.jobId ?? null);
    },
  });

  const handleUpload = () => {
    setLoading(true);
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
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);

        setLoadingMessage(loadingMessages[randomIndex] ?? "loading...");
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div className="mb-32 flex flex-col items-center justify-center gap-2 md:mb-0 md:min-h-[30vh]">
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
          />
        )}
      </div>

      {fileWrapper && (
        <div className="w-1/2 sm:w-1/3 lg:w-1/5">
          <Button
            onClick={handleUpload}
            isLoading={loading}
            label="Upload"
            loadingLabel="Uploading..."
          />
        </div>
      )}
      {loading && loadingMessage && (
        <p className="font-second text-sm text-foreground">{loadingMessage}</p>
      )}

      {createdImageScore && (
        <UploadModal
          imageScore={createdImageScore}
          emoji={
            scoresInfo[scoreIndex(createdImageScore?.score ?? 0)]?.emoji ?? ""
          }
          scoreDescription={
            scoresInfo[scoreIndex(createdImageScore?.score ?? 0)]
              ?.description ?? ""
          }
          onClose={() => {
            if (fileWrapper) {
              URL.revokeObjectURL(fileWrapper.url);
            }
            setCreatedImageScore(null);
            setFileWrapper(null);
          }}
        />
      )}
    </div>
  );
}
