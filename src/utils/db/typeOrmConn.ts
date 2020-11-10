import "reflect-metadata";
import "dotenv/config";
import { Connection, createConnection, getConnection, BaseEntity, ObjectType } from "typeorm";
import { User } from "../../entity/User/User";
import { config } from "dotenv";
import { Link } from "../../entity/Link/Link";

// import util from "util";
// import logger from "../logger";

config({
  path: "../../.env"
});

export const createTypeOrmConnection = async (
  host: string, port: number, username: string, password: string, database: string
): Promise<Connection> => {
  return createConnection({
    type: "postgres",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: true,
    logging: "all",
    entities: [
      User,
      Link
    ]
  }).then(connection => {

    console.log(`\n✅  Database connected successfully ${connection} 🚀\n`);
    // logger.info("Connected to Postgres successfully!");
    return connection;

  });
};

export function Query() {
  return getConnection().createQueryBuilder();
}

