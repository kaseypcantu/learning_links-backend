import 'dotenv/config';
import Redis, { RedisOptions } from 'ioredis';
import logger from './logger';
import { REDIS_PROD_HOST, REDIS_DEV_HOST, isProd } from './config';

export const redis = new Redis({
  host: isProd ? REDIS_PROD_HOST : REDIS_DEV_HOST, // TODO: Change this ternary to work under the new docker workflows.
  port: 6379,
});

redis
  .on('connect', () => {
    console.log('\nConnected to the Redis Server successfully!\n');
  })
  .on('ready', () => {
    console.log('Redis is ready for connections!\n');
  })
  .on('error', (err) => {
    logger.error(err, err.message);
  })
  .on('close', () => {
    console.log('\nRedis connection closed..\n');
  })
  .on('reconnecting', () => {
    console.log('\nReconnecting to the Redis Server...\n');
  })
  .on('end', () => {
    console.log('\nREDIS END\n');
  });
