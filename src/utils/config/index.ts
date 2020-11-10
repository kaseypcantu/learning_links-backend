import "dotenv/config";
import logger from "../logger";
import { createTypeOrmConnection } from "../db/typeOrmConn";
import { redis } from "../redis";
import { Connection } from "typeorm";

export const PG_USER = process.env.POSTGRES_USER as string;
export const PG_PASSWORD = process.env.POSTGRES_PASSWORD as string;
export const PG_HOST = process.env.POSTGRES_HOST as string;
export const PG_DATABASE = process.env.POSTGRES_DB as string;
export const PG_PORT = Number.parseInt(process.env.POSTGRES_PORT as string) ?? 5432;
export const ELASTICACHE_HOST = process.env.AWS_ELASTICACHE_HOST as string;
export const ELASTICACHE_PORT = Number.parseInt(process.env.AWS_ELASTICACHE_PORT as string);
export const ELASTICACHE_PASSWORD = process.env.AWS_ELASTICACHE_PASSWORD as string;
export const ELASTICACHE = process.env.AWS_ELASTICACHE as string;
export const LOG_LEVEL = process.env.LOG_LEVEL as string ?? "debug";
export const isProd = process.env.NODE_ENV === "production";

function logFormatFlag(): string {
  if (process.argv.includes("--console")) {
    return "console";
  }
  return "json";
}

export const LOG_FORMAT = logFormatFlag() ? process.env.LOG_FORMAT as string : "json";

// const criticalValues: object = {
//   "PG_HOST": PG_HOST,
//   "PG_USER": PG_USER,
//   "PG_PASSWORD": PG_PASSWORD,
//   "PG_DATABASE": PG_DATABASE
// };

export const initDB = async (): Promise<void> => {
  await createTypeOrmConnection(
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASSWORD,
    PG_DATABASE
  );
};

// Object.entries(criticalValues).forEach(([key, value]) => {
//   if (value) {
//     return;
//   }
//   logger.error(`Required Config: ${key} is missing`);
// });
