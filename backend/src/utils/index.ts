import validate from "./services/validation.ts";
import mail from "./services/mail.ts";

let utils: any = { validate: {}, mail: {} };

/**
 * Validate user object to the shema of the user
 * @param user object
 */
utils.validate.input = async (user: object) => {
  await validate.input(user);
  return true;
};

/**
 * Validate user password, check if the stored
 * @param email string
 * @param password string
 */
utils.validate.password = async (
  email: string,
  password: string,
  type: string,
) => {
  const result = await validate.password(email, password, type);
  return result;
};

/**
 * Send an email
 * @param to string
 * @param subject string
 * @param content string
 */
utils.mail.send = async (to: string, subject: string, content: string) => {
  await mail.send(to, subject, content);
  return true;
};

export default utils;
