interface UploadModalProps {
  image: string;
  score: number;
  emoji: string;
  scoreDescription: string;
  imageDescription: string;
  onClose: () => void;
}

export function UploadModal({
  image,
  score,
  emoji,
  scoreDescription,
  imageDescription,
  onClose,
}: UploadModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative flex min-h-[40vh] lg:min-h-[60vh] w-[80vw] lg:w-[65vw] flex-col items-center justify-around gap-10 rounded-lg border border-border bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 font-primary text-foreground hover:text-border"
        >
          ✕
        </button>
        <div className="flex flex-col md:flex-row items-center justify-around gap-10">
          <img
            src={image}
            className="h-[30vh] lg:h-[40vh] w-[80%] lg:w-[40%] object-cover"
            // onLoad={() => {
            //   URL.revokeObjectURL(image);
            // }}
          />
          <div className="flex w-full flex-col items-center gap-3 text-center lg:w-1/2">
            <div className="font-second text-4xl font-bold">
              {score} {emoji}
            </div>
            <p className="font-second text-base font-bold text-foreground">
              {scoreDescription}
            </p>
            <p className="font-second text-base text-foreground">
              {imageDescription}
            </p>
          </div>
        </div>
        <button
          className="mt-4 w-1/2 lg:w-1/3 rounded-md border border-border p-2 font-second text-base font-bold text-foreground hover:bg-foreground hover:text-background"
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
