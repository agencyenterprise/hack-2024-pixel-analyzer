import Redis from "ioredis";

export const redisConnection = new Redis(
  process.env.REDIS_URL + "?family=0",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
);
