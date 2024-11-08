import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type ImageScore } from "@/types/image-scores";

// Mocked DB
const imageScores: ImageScore[] = [];

export const imageScoresRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        file_name: z.string().min(1),
        file_type: z.string().min(1),
        file_data: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const imageScore: ImageScore = {
        id: String(imageScores.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        file_name: input.file_name,
        file_type: input.file_type,
        file_data: input.file_data,
        score: Math.floor(Math.random() * 100),
        reason: "lorem ipsum dolor sit amet consectetur adipiscing elit",
        user_name: "",
      };
      imageScores.push(imageScore);
      return imageScore;
    }),

  getAll: publicProcedure.query(() => {
    return imageScores.sort((a, b) => b.score - a.score) ?? [];
  }),
});
