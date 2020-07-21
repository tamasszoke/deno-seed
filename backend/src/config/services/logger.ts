import { log } from "../../../deps.ts";
import settings from "./settings.ts";

const { env } = settings;

/**
 * Configure logging
 */
await log.setup({
  handlers: {
    functionFmt: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (logRecord) => {
        let time = Date().slice(16, 21);
        let msg = `${time} [${logRecord.levelName}] ${logRecord.msg}`;

        logRecord.args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
        return msg;
      },
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["functionFmt"],
    },
    tests: {
      level: "CRITICAL",
      handlers: ["functionFmt"],
    },
  },
});

let logger = log.getLogger();

if (env === "test") {
  logger = log.getLogger("tests");
}

export default logger;
