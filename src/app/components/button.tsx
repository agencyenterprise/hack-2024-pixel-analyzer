"use client";

interface UploadButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
}

export function Button({
  label,
  loadingLabel = label,
  onClick,
  isLoading = false,
}: UploadButtonProps) {
  return (
    <button
      className={`w-full rounded-md border border-border p-2 font-second text-base font-bold text-foreground ${isLoading ? "animate-pulse" : "hover:bg-foreground hover:text-background"}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
