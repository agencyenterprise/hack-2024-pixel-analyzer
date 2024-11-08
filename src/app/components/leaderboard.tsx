"use client";

import { api } from "@/trpc/react";

const colorsByIndex: Record<number, string> = {
  0: "bg-gold border-gold",
  1: "bg-silver border-silver",
  2: "bg-bronze border-bronze",
};

export function Leaderboard() {
  const { data = [] } = api.imageScores.getAll.useQuery();

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-second text-center text-3xl font-semibold tracking-wider">
        Leaderboard
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-foreground/[2.5%] text-foreground relative rounded-lg border shadow"
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
              <h5 className="font-second mb-2 text-center text-2xl font-bold tracking-tight">
                {item.score}
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
