"use client";
interface UploadButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function UploadButton({ onClick, isLoading }: UploadButtonProps) {

  return (
    <button
      className={`hover:bg-foreground/[2.5%] w-[200px] rounded-md border p-4 font-extrabold ${isLoading && 'animate-pulse'}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? "Uploading..." : "Upload"}
    </button>
  );
}
