import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { addToCreateImageScoreQueue } from "@/server/jobs/create-image-score";

const createSchema = z.object({
  file_name: z.string().min(1),
  file_type: z.string().min(1),
  file_data: z.string().min(1),
});

export const imageScoresRouter = createTRPCRouter({
  create: publicProcedure.input(createSchema).mutation(async ({ input }) => {
    await addToCreateImageScoreQueue({ input });

    return { success: true };
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const imageScores = await ctx.db.imageScore.findMany({
      orderBy: { score: "desc" },
    });

    return imageScores;
  }),
});
