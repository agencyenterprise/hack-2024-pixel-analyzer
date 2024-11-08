import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  addToCreateImageScoreQueue,
  getJobById,
} from "@/server/jobs/create-image-score";

const createSchema = z.object({
  file_name: z.string().min(1),
  file_type: z.string().min(1),
  file_data: z.string().min(1),
});

const getJobSchema = z.object({
  jobId: z.string().min(1),
});

export const imageScoresRouter = createTRPCRouter({
  create: publicProcedure.input(createSchema).mutation(async ({ input }) => {
    const { id } = await addToCreateImageScoreQueue({ input });

    return { success: true, jobId: id };
  }),

  getJob: publicProcedure.input(getJobSchema).mutation(async ({ input }) => {
    const job = await getJobById(input.jobId);

    return { success: true, job };
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 7;
      const offset = input.cursor ?? 0;

      const count = await ctx.db.imageScore.count();

      const data = await ctx.db.imageScore.findMany({
        take: limit + 1,
        skip: offset,
        orderBy: { score: "desc" },
      });

      return {
        data,
        limit,
        offset,
        hasMore: count ? offset + limit + 1 < count : false,
        total: count ?? 0,
      };
    }),
});
