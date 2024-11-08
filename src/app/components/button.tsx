"use client";
interface UploadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label: string
  loadingLabel?: string
}

export function Button({ label, loadingLabel = label, onClick, isLoading }: UploadButtonProps) {

  return (
    <button
      className={`text-foreground w-[100%] font-second text-base font-bold rounded-md border border-border p-2 ${isLoading ? "animate-pulse" : "hover:bg-foreground hover:text-background"}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
