import { dotEnv } from "../../../deps.ts";
import { bcrypt } from "../../../deps.ts";

const env: string = Deno.env.toObject().ENV || "test";
const envPath: string = `.env/.env.${env}`;
const envConfig = dotEnv({
  path: envPath,
});
const redisSecret: string = await bcrypt.genSalt(8);

/**
 * Configuration
 */
const config: ({
  env: string;
  appName: string;
  ip: string;
  host: string;
  port: number;
  protocol: string;
  clientHost: string;
  clientPort: number;
  clientProtocol: string;
  url: string;
  clientUrl: string;
  redisHost: string;
  redisPort: number;
  redisSecret: string;
  sslOptions: any;
  emailAddress: string;
  emailPassword: string;
  mongoUrl: string;
  dbName: string;
  clientStaticFolder: string;
  clientBuildFolder: string;
  paypalClientId: string;
  paypalClientSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  githubClientId: string;
  githubClientSecret: string;
}) = {
  env,
  appName: envConfig.APP_NAME,
  ip: envConfig.IP,
  host: envConfig.HOST,
  port: Number(envConfig.PORT),
  protocol: envConfig.PROTOCOL,
  clientHost: envConfig.CLIENT_HOST,
  clientPort: Number(envConfig.CLIENT_PORT),
  clientProtocol: envConfig.CLIENT_PROTOCOL,
  url: `${envConfig.PROTOCOL}://${envConfig.HOST}:${envConfig.PORT}`,
  clientUrl:
    `${envConfig.CLIENT_PROTOCOL}://${envConfig.CLIENT_HOST}:${envConfig.CLIENT_PORT}`,
  redisHost: envConfig.REDIS_HOST,
  redisPort: Number(envConfig.REDIS_PORT),
  redisSecret,
  sslOptions: {
    crt: `./ssl/${envConfig.SSL_CRT}`,
    key: `./ssl/${envConfig.SSL_KEY}`,
  },
  emailAddress: envConfig.EMAIL_ADDRESS,
  emailPassword: envConfig.EMAIL_PASS,
  mongoUrl: `mongodb://${envConfig.DB_USER}:${
    encodeURIComponent(envConfig.DB_PASS)
  }@${envConfig.DB_HOST}/${envConfig.DB_NAME}`,
  dbName: envConfig.DB_NAME,
  clientStaticFolder: "client/build/static",
  clientBuildFolder: "client/build",
  paypalClientId: envConfig.PAYPAL_CLIENT_ID || "",
  paypalClientSecret: envConfig.PAYPAL_CLIENT_SECRET || "",
  googleClientId: envConfig.GOOGLE_CLIENT_ID || "",
  googleClientSecret: envConfig.GOOGLE_CLIENT_SECRET || "",
  githubClientId: envConfig.GITHUB_CLIENT_ID || "",
  githubClientSecret: envConfig.GITHUB_CLIENT_SECRET || "",
};

/**
 * Production config
 */
if (env === "production") {
  config.clientStaticFolder = "client/static";
  config.clientBuildFolder = "client";
}

export default config;
