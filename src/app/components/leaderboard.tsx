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
  const [data = []] = api.imageScores.getAll.useSuspenseQuery();

  if (data.length === 0) return <div>null</div>;

  const orderedData = data.sort((a, b) => b.score - a.score);

  const scoreIndex = (score: number): number => {
    return Math.floor(score / 10);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-second text-center text-3xl pb-5 font-semibold tracking-wider">
        Leaderboard
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {orderedData.map((item, index) => (
          <div
            key={index}
            className="bg-foreground/[2.5%] dark:bg-foreground/10 text-foreground relative rounded-lg border border-border shadow"
          >
            <div
              className={`absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full border font-bold shadow-md ${colorsByIndex[index] ?? "bg-border/90 border-border text-foreground/60 dark:text-foreground"}`}
            >
              {index + 1}
            </div>

            <img
              className="h-48 w-full rounded-t-lg object-cover shadow-md shadow-foreground/10"
              src={item.file_data}
              alt=""
            />

            <div className="px-4 py-2">
              <h5 className="font-second mb-2 text-center text-2xl font-bold tracking-tight">
                {item.score} {scoreDescriptions[scoreIndex(item.score || 0)]?.emoji}
              </h5>
              <p className="font-second mb-3 text-sm font-normal">
                {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
