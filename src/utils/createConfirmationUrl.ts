import { v4 } from "uuid";
import { redis } from "./redis";

export async function createConfirmationUrl(userId: string): Promise<string> {
  const token: string = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24)
    .then(d => console.log(`REDIS_SET: ${d} -> ${token}`))
    .catch(err => console.error(`ERROR -> REDIS_SET: ${err}`));

  return `https://kaseyplatform.ngrok.io/user/confirm/${token}`;
}
