"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { scoresInfo } from "@/types/score-info";
import { scoreIndex } from "@/utils/scoreIndex";
import { type ImageScore } from "@prisma/client";

const colorsByIndex: Record<number, string> = {
  0: "bg-gold border-gold text-white",
  1: "bg-silver border-silver text-white",
  2: "bg-bronze border-bronze text-white",
};

export function Leaderboard() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const {
    data: dataParams,
    fetchNextPage,
    isLoading,
  } = api.imageScores.getAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.offset + lastPage.limit + 1,
    },
  );

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const data =
    dataParams?.pages.flatMap((page) => page.data) ?? ([] as ImageScore[]);
  const hasMore =
    (dataParams?.pages ?? [])?.length > 0
      ? (dataParams?.pages?.[dataParams.pages.length - 1]?.hasMore ?? false)
      : false;

  return (
    <div className="flex flex-col gap-4 p-5">
      <h2 className="pb-5 text-center font-second text-3xl font-semibold tracking-wider">
        Leaderboard
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex w-full animate-pulse flex-col overflow-hidden rounded-lg border border-border bg-foreground/[2.5%] shadow"
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
          data.map((item, index) => {
            const canExpanded = item.reason.length > 110;
            const isExpanded = expandedIndex === index;
            const truncatedReason =
              item.reason.length > 105
                ? item.reason.substring(0, 105) + "..."
                : item.reason;

            return (
              <div
                key={index}
                className={`relative rounded-lg border border-border bg-foreground/[2.5%] text-foreground shadow ${isExpanded ? "h-full" : "h-fit"} `}
              >
                <div
                  className={`absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border font-bold text-white shadow-md ${colorsByIndex[index] ?? "bg-gray-400 dark:bg-gray-800"}`}
                >
                  {index + 1}
                </div>

                <img
                  className="h-48 w-full rounded-t-lg border-b border-border object-cover"
                  src={item.file_data}
                  alt=""
                />

                <div className="px-4 py-2">
                  <h5 className="mb-2 text-center font-second text-2xl font-bold tracking-tight">
                    {item.score} {scoresInfo[scoreIndex(item.score)]?.emoji}
                  </h5>
                  <p className="mb-3 font-second text-sm font-normal">
                    {canExpanded && !isExpanded
                      ? truncatedReason
                      : item.reason}
                    <span
                      className={`pl-1 text-cyan-600 hover:underline ${canExpanded && "cursor-pointer"}`}
                      onClick={() => canExpanded && handleCardClick(index)}
                    >
                      {isExpanded ? "read less" : "read more"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}

        {!isLoading && hasMore && (
          <button
            className="col-span-full text-center"
            onClick={() => fetchNextPage()}
          >
            Load more
          </button>
        )}

        {!isLoading && data.length === 0 && (
          <div className="col-span-full text-center">No data =/</div>
        )}
      </div>
    </div>
  );
}
