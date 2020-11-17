import crypto from "crypto";
import "reflect-metadata";
import { config } from "dotenv";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

config({
  path: "../.env"
});

import cors from "cors";
import bodyParser from 'body-parser';
import Express from "express";
import winston from "winston";
import RateLimit from "express-rate-limit";
import session from "express-session";
import expressWinston from 'express-winston';
import RateLimitedRedisStore from "rate-limit-redis";
import connectRedis from "connect-redis";
import errorsMiddleWare from "../middleware/errors";

import { redis } from "./redis";
import { app_config } from "./app_config";
import { redisSessionPrefix } from "./constants";
import { RegisterResolver } from "../graphql/modules/users/register/RegisterResolver";
import { LoginResolver } from "../graphql/modules/users/login/LoginResolver";
import { UserResolver } from "../graphql/modules/users/UserResolver";
import { ConfirmUserResolver } from "../graphql/modules/users/register/ConfirmUserResolver";
import { initDB } from "./config";
import LoggingMiddleware from "../middleware/logging";
import { getTransactionId } from "./db/transaction_storage";
import logger from "./logger";
import morgan from "morgan";
import { LinksResolver } from '../graphql/modules/links/LinksResolver';
import { CreateLinkResolver } from '../graphql/modules/links/createLink/CreateLinkResolver';

// TODO: add cluster functionality here!

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const ngrok = app_config.ngrok.enabled ? require("ngrok") : null;

const SESSION_SECRET: string = crypto.randomBytes(32).toString("hex");
logger.debug(`SESSION_SECRET: ${SESSION_SECRET}`);  // TODO: Need to fix logger to see why its not generating txIds


export const startServer = async () => {
  await redis.flushall();

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      RegisterResolver,
      LoginResolver,
      ConfirmUserResolver,
      LinksResolver,
      CreateLinkResolver
    ],
    validate: true,
    authChecker: ({ context: { req } }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return !!req.session.userId;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const server = new ApolloServer({
    debug: true,
    schema: schema,
    introspection: true,
    logger: logger,
    playground: {
      workspace: "KpcGraphqlServer",
      settings: {
        "editor.fontSize": 16,
        "editor.cursorShape": "underline",
        "schema.disableComments": false,
        "tracing.tracingSupported": true,
        "request.credentials": "include"
      } as object
    } as object,
    context: ({ req }) => ({ req })
  });

  const app = Express();

  app.use(morgan("dev"));

  app.use(
    RateLimit({
      store: new RateLimitedRedisStore({
        client: redis as any
      } as object),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      delayMs: 0 // disable delaying - full speed until the max limit is reached
    } as object)
  );

  const RedisStore = connectRedis(session as any);

  app.use(cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "development"
        ? "*"
        : process.env.FRONTEND_HOST as string
  }));

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: redisSessionPrefix
      }),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  app.use(LoggingMiddleware);

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    dynamicMeta: () => {
      return { transactionId: getTransactionId() };
    },
    headerBlacklist: ["api-key", "auth-token"], // TODO: add API Key model and user relation.
    ignoredRoutes: ["/favicon.ico","/api/diagnostics/heartbeat"]
  }));

  expressWinston.bodyBlacklist.push("password");

  app.use(errorsMiddleWare);

  let retries = 5;
  while (retries) {
    try {
      await initDB();
      break;
    } catch (err) {
      retries -= 1;
      logger.error(err, {
        "retries": `Database:postgres connection retries left ${retries}`,
        "message": err.message
      });
      await new Promise(res => setTimeout(res, 5000));
    }
    console.log('Could not connect to PostgreSQL Server...');
  }

  await server.applyMiddleware({ app: app });

  app.listen(process.env.PORT, () => {
    console.log(`Apollo 🚀 Express Server listening on PORT:${process.env.PORT}, visit the GraphQL API @ http://localhost:${process.env.PORT}/graphql 🚀`);
  });

  if (ngrok) {
    ngrok
      .connect({
        addr: app_config.ngrok.port,
        subdomain: app_config.ngrok.subdomain,
        authtoken: app_config.ngrok.authtoken
      })
      .then((url: string) => {
        console.log(`GraphQL Endpoint -> ${url}/graphql\n`);
        // open(url + '/graphql');
        //open(url+ '/verify');
      })
      .catch((err: any) => {
        if (err.code === "ECONNREFUSED") {
          console.log(`⚠️  Connection refused at ${err.address}:${err.port}`);
        } else {
          console.log(`⚠️ Ngrok error: ${JSON.stringify(err)}`);
        }
        process.exit(1);
      });
  }
};
