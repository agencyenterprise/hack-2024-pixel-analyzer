import { type ImageScore } from "@prisma/client";
import { Button } from "@/app/components/button";

interface UploadModalProps {
  imageScore: ImageScore;
  emoji: string;
  scoreDescription: string;
  onClose: () => void;
}

export function UploadModal({
  imageScore,
  emoji,
  scoreDescription,
  onClose,
}: UploadModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative flex min-h-[40vh] w-[80vw] flex-col items-center justify-around gap-10 rounded-lg border border-border bg-background p-6 shadow-lg lg:min-h-[60vh] lg:w-[65vw]">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 font-primary text-foreground hover:text-border"
        >
          ✕
        </button>
        <div className="flex flex-col items-center justify-around gap-10 lg:flex-row">
          <img
            src={imageScore.file_data}
            className="h-[30vh] w-[80%] object-cover lg:h-[40vh] lg:w-[40%]"
          />
          <div className="flex w-full flex-col items-center gap-3 text-center lg:w-1/2">
            <div className="font-second text-6xl font-bold">
              {imageScore.score} {emoji}
            </div>
            <p className="font-second text-xl font-extrabold text-foreground">
              {scoreDescription}
            </p>
            <p className="font-second text-base text-foreground">
              {imageScore.reason}
            </p>
          </div>
        </div>
        <div className="mt-4 w-1/2 lg:w-1/3 items-center">
          <Button
            onClick={onClose}
            label="Ok"
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}
