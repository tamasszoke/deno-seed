import { SmtpClient } from "../../../deps.ts";
import { settings } from "../../config/index.ts";
import validate from "./validation.ts";

/**
 * Send an email
 * @param to string
 * @param subject string
 * @param content string
 */
const send = async (to: string, subject: string, content: string) => {
  if (!validate.email(to) || subject.length <= 1 || content.length <= 1) {
    throw "Bad email parameters!";
  }
  if (settings.env === "test") {
    return true;
  }
  const { emailAddress, emailPassword } = settings;
  const client = new SmtpClient();
  const connectConfig: any = {
    hostname: "smtp.gmail.com",
    port: 465,
    username: emailAddress,
    password: emailPassword,
  };
  await client.connectTLS(connectConfig);
  await client.send({
    from: `${settings.appName}@boilerplate.com`,
    to,
    subject,
    content,
  });
  await client.close();
  return true;
};

export default {
  send,
};
