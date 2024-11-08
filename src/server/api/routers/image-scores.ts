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

  getAll: publicProcedure.query(async ({ ctx }) => {
    const imageScores = await ctx.db.imageScore.findMany({
      orderBy: { score: "desc" },
    });

    return imageScores;
  }),
});
