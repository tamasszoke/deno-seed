import { Session } from "../../../deps.ts";
import settings from "./settings.ts";
import log from "./logger.ts";

/**
 * Initialize sessions
 * @param app any
 */
const init = async (app: any) => {
  const { redisHost, redisPort } = settings;
  try {
    const session = new Session({
      framework: "oak",
      store: "redis",
      hostname: redisHost,
      port: redisPort,
    });
    await session.init();
    await app.use(session.use()(session));
  } catch (error) {
    log.error("Redis error, using the memory for sessions!");
    const session = new Session({
      framework: "oak",
    });
    await session.init();
    await app.use(session.use()(session));
  }
};

export default {
  init,
};
