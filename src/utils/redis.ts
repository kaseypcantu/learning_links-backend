import "dotenv/config";
import Redis, { RedisOptions } from "ioredis";
import logger from "./logger";
import { ELASTICACHE_HOST, ELASTICACHE_PASSWORD, ELASTICACHE_PORT, isProd } from "./config";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379
});


redis.on("connect", () => {
  console.log("\nConnected to the Redis Server successfully!\n");
})
  .on("ready", () => {
    console.log("Redis is ready for connections!\n");
  })
  .on("error", err => {
    logger.error(err, err.message);
  })
  .on("close", () => {
    console.log("\nRedis connection closed..\n");
  })
  .on("reconnecting", () => {
    console.log("\nReconnecting to the Redis Server...\n");
  })
  .on("end", () => {
    console.log("\nREDIS END\n");
  });
