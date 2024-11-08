"use client";

import { api } from "@/trpc/react";

const colorsByIndex: Record<number, string> = {
  0: "bg-gold border-gold text-white",
  1: "bg-silver border-silver text-white",
  2: "bg-bronze border-bronze text-white",
};

const scoreDescriptions = [
  { emoji: "💀", description: "Is this... even a photo?" },
  { emoji: "😬", description: "Oof, there's potential, but it's buried!" },
  { emoji: "🫠", description: "Well… you did try, right?" },
  { emoji: "😐", description: "Not bad, but could use some work!" },
  { emoji: "🤔", description: "Interesting... still deciding what to think!" },
  { emoji: "🙂", description: "Alright, we’re getting somewhere!" },
  { emoji: "😊", description: "Nice! This is pretty solid." },
  { emoji: "😎", description: "Cool stuff! Almost pro-level!" },
  { emoji: "🤯", description: "Wow! That’s a masterpiece in the making!" },
  { emoji: "🤩", description: "Absolutely epic! You nailed it!" },
];

export function Leaderboard() {
  const { data = [], isLoading } = api.imageScores.getAll.useQuery();

  const scoreIndex = (score: number): number => {
    return Math.floor(score / 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="pb-5 text-center font-second text-3xl font-semibold tracking-wider">
        Leaderboard
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex w-full animate-pulse flex-col overflow-hidden rounded-lg border bg-foreground/[2.5%] shadow"
            >
              <div className="h-48 w-full bg-foreground/20" />
              <div className="flex flex-col gap-2 px-4 py-2 pb-5">
                <div className="mx-auto h-6 w-1/3 rounded-md bg-foreground/20" />
                <div className="h-2 w-full rounded-sm bg-foreground/20 text-center" />
                <div className="h-2 w-full rounded-sm bg-foreground/20 text-center" />
                <div className="h-2 w-full rounded-sm bg-foreground/20 text-center" />
                <div className="h-2 w-full rounded-sm bg-foreground/20 text-center" />
              </div>
            </div>
          ))}

        {!isLoading &&
          data.map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg border bg-foreground/[2.5%] text-foreground shadow"
            >
              <div
                className={`absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full border font-bold text-white shadow-md ${colorsByIndex[index] ?? "bg-border"}`}
              >
                {index + 1}
              </div>

              <img
                className="h-48 w-full rounded-t-lg object-cover"
                src={item.file_data}
                alt=""
              />

              <div className="px-4 py-2">
                <h5 className="mb-2 text-center font-second text-2xl font-bold tracking-tight">
                  {item.score}{" "}
                  {scoreDescriptions[scoreIndex(item.score || 0)]?.emoji}
                </h5>
                <p className="mb-3 font-second text-sm font-normal">
                  {item.reason}
                </p>
              </div>
            </div>
          ))}

        {!isLoading && data.length === 0 && (
          <div className="col-span-full text-center">No data =/</div>
        )}
      </div>
    </div>
  );
}
