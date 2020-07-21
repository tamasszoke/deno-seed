import { send } from "../../deps.ts";
import defaultRouter from "./services/default.ts";
import authRouter from "./services/auth.ts";
import userRouter from "./services/user.ts";

/**
 * Initializing routes
 * @param app Any
 */
const init = (app: any) => {
  app.use(authRouter.routes());
  app.use(userRouter.routes());
  app.use(defaultRouter.routes());

  app.use(authRouter.allowedMethods());
  app.use(userRouter.allowedMethods());
  app.use(defaultRouter.allowedMethods());
};

export default {
  init,
};
