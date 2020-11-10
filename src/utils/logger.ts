import winston from "winston";

const devFormat = require("winston-dev-format");
import { TransformableInfo } from "logform";
import { v4 } from "uuid";
import { getTransactionId, setTransactionId, generateV4_UUID, namespace, V5_UUID } from "./db/transaction_storage";
import { LOG_FORMAT, LOG_LEVEL } from "./config";

const fmt = winston.format;

const attachTransactionId = fmt(information => {
  information.transactionId = getTransactionId() === "no_transaction_id" ? v4() : new V5_UUID().generate();
  return information;
});

export const jsonOptions: winston.LoggerOptions = {
  format: fmt.combine(
    fmt.timestamp(),
    fmt.metadata(),
    attachTransactionId(),
    fmt.json(),
    fmt.prettyPrint({ colorize: true, depth: 8 })
  ),
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL,
      format: fmt.colorize({
        all: true,
        colors: {
          trace: "magenta",
          input: "grey",
          verbose: "cyan",
          prompt: "grey",
          debug: "blue",
          info: "green",
          data: "grey",
          help: "cyan",
          warn: "yellow",
          error: "red"
        }
      })
    }),
    new winston.transports.File({
      dirname: "../../../logs/",
      filename: "nodeEventsJson.log",
      tailable: true,
      level: LOG_LEVEL,
      format: fmt.uncolorize(),
      eol: `\n\u2191 Transaction ID: ${"kasey_aws-" + getTransactionId()} \u2191\n\n`
    })
  ]
};

function print(msg: any): string {
  if (typeof msg === "string") {
    return msg;
  } else if (msg && Object.keys(msg).length > 0) {
    return JSON.stringify(msg);
  }
  return "";
}

const debugPrint = (info: TransformableInfo) => {
  const metadata = info.metedata;
  const transactionId = info.transactionId?.slice(0, 8) ?? "";
  const timestamp = metadata?.timestamp.slice(11) ?? "";
  const metadataCopy = {
    ...metadata
  };

  delete metadataCopy.timestamp;

  return `${timestamp} ${transactionId} ${info.level} ${print(
    info.message
  )} ${print(metadataCopy)}`;
};


export const consoleOptions: winston.LoggerOptions = {
  format: fmt.combine(
    fmt.timestamp(),
    fmt.metadata(),
    attachTransactionId(),
    fmt.colorize({
      level: true,
      all: true,
      colors: {
        trace: "magenta",
        input: "grey",
        verbose: "cyan",
        prompt: "grey",
        debug: "blue",
        info: "green",
        data: "grey",
        help: "cyan",
        warn: "yellow",
        error: "red"
      }
    }),
    devFormat(fmt.printf(debugPrint))
  ),
  transports: [
    new winston.transports.Console({ level: LOG_LEVEL }),
    new winston.transports.File({
      dirname: "../../../logs/",
      filename: "nodeEventsConsole.log",
      tailable: true,
      level: LOG_LEVEL,
      format: fmt.uncolorize(),
      eol: `\n\u2191 Transaction ID: ${"kasey_aws-" + getTransactionId()} \u2191\n\n`
    })
  ]
};


const logger = winston.createLogger(LOG_LEVEL === "json" ? jsonOptions : consoleOptions);

// logger.log(logger.level, "<-- logging at this level ", {
//   "helloKasey": "this is metadata",
//   "log_format": `${LOG_FORMAT}`
// });

export const consoleLogger = winston.createLogger(consoleOptions);

export const jsonLogger = winston.createLogger(jsonOptions);

export default logger;
