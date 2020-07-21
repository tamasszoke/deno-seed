import { Application, oakCors } from "./deps.ts";
import { session, log, settings } from "./src/config/index.ts";
import router from "./src/router/index.ts";

const { port, url, clientUrl } = settings;
const app = new Application();

const corsOptions = {
  "origin": clientUrl,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "credentials": true,
};

app.use(oakCors(corsOptions));
await session.init(app);
router.init(app);

app.addEventListener("listen", () => {
  log.info(`Server listening at ${url}`);
});

if (import.meta.main) {
  await app.listen({ port });
}

export { app };
