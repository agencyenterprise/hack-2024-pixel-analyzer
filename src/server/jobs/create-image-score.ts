import { Worker, Queue } from "bullmq";
import Anthropic from "@anthropic-ai/sdk";
import { type MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { z } from "zod";

import { redisConnection } from "@/server/redis";
import { db } from "@/server/db";

const queueName = "create-image-score";

const createSchema = z.object({
  file_name: z.string().min(1),
  file_type: z.string().min(1),
  file_data: z.string().min(1),
});

interface QueueInterface {
  input: z.infer<typeof createSchema>;
}

export const imageScoreQueue = new Queue(queueName, {
  connection: redisConnection,
});

new Worker(
  queueName,
  async (job) => {
    const { input } = job.data as QueueInterface;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });

    const anthropicMessages: MessageParam[] = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.file_type as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: input.file_data.replace(/^data:image\/[a-z]+;base64,/, ""),
            },
          },
        ],
      },
    ];

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      messages: anthropicMessages,
      max_tokens: 4096,
      system: `
        You are an objective image evaluator.
        Analyze the image and assign a random score between 1-100, without any specific criteria or bias.
        You need to be very strict and harsh with the score.
        Respond only with a valid JSON object in this exact format: {"score": number, "reason": string}.
        The reason should be a brief and detailed explanation (2 sentences) that specifically describes which aspects influenced the score, highlighting both strengths and areas for improvement.
        `,
      temperature: 1,
    });
    const messageContent = message?.content[0] as Anthropic.TextBlock;

    const parsedMessage = JSON.parse(messageContent?.text) as {
      score: number;
      reason: string;
    };

    const createdImageScore = await db.imageScore.create({
      data: {
        file_name: input.file_name,
        file_type: input.file_type,
        file_data: input.file_data,
        score: parsedMessage.score,
        reason: parsedMessage.reason,
        user_name: "",
      },
    });

    return createdImageScore;
  },
  {
    connection: redisConnection,
  },
);

export const addToCreateImageScoreQueue = (data: QueueInterface) => {
  return imageScoreQueue.add(queueName, data);
};

export const getJobById = (jobId: string) => {
  return imageScoreQueue.getJob(jobId);
};
