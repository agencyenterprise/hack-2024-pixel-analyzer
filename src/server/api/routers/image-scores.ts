import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type ImageScore } from "@/types/image-scores";
import { type MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";

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
      // const anthropic = new Anthropic({
      //   apiKey: process.env.ANTHROPIC_API_KEY ?? "",
      // });

      // const anthropicMessages: MessageParam[] = [
      //   {
      //     role: "user",
      //     content: [
      //       {
      //         type: "image",
      //         source: {
      //           type: "base64",
      //           media_type: input.file_type as
      //             | "image/jpeg"
      //             | "image/png"
      //             | "image/gif"
      //             | "image/webp",
      //           data: input.file_data.replace(
      //             /^data:image\/[a-z]+;base64,/,
      //             "",
      //           ),
      //         },
      //       },
      //     ],
      //   },
      // ];

      // const message = await anthropic.messages.create({
      //   model: "claude-3-sonnet-20240229",
      //   messages: anthropicMessages,
      //   max_tokens: 4096,
      //   system: `
      //     You are an objective image evaluator.
      //     Analyze the image and assign a random score between 1-100, without any specific criteria or bias.
      //     Respond only with a valid JSON object in this exact format: {"score": number, "reason": string}.
      //     The reason should be a brief and detailed explanation (2 sentences) that specifically describes which aspects influenced the score, highlighting both strengths and areas for improvement.
      //     `,
      //   temperature: 1,
      // });
      // const messageContent = message?.content[0] as Anthropic.TextBlock;

      // const parsedMessage = JSON.parse(messageContent?.text) as {
      //   score: number;
      //   reason: string;
      // };

      const imageScore: ImageScore = {
        id: String(imageScores.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        file_name: input.file_name,
        file_type: input.file_type,
        file_data: input.file_data,
        // score: parsedMessage.score,
        score: Math.floor(Math.random() * 101),
        // reason: parsedMessage.reason,
        reason: "This is a big description for the image...  image is good",
        user_name: "",
      };
      imageScores.push(imageScore);
      return imageScore;
    }),

  getAll: publicProcedure.query(() => {
    return imageScores.sort((a, b) => b.score - a.score) ?? [];
  }),
});
