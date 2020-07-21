import { bcrypt } from "../../../deps.ts";
import utils from "../../utils/index.ts";
import { db, settings } from "../../config/index.ts";

/**
 * Logging in
 * @param email string
 * @param password string
 */
const login = async (email: string, password: string) => {
  return await utils.validate.password(email, password);
};

/**
 * Registering a new account
 * @param email string
 * @param password string
 * @param name string
 * @param username string
 */
const registration = async (
  email: string,
  password: string,
  name: string,
  username: string,
) => {
  const { clientUrl } = settings;
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  let activationHash = await bcrypt.genSalt(10);
  activationHash = encodeURIComponent(activationHash).replaceAll(".", "");
  const created = new Date().toISOString();
  const data = {
    email,
    password: hash,
    salt,
    name,
    username,
    admin: false,
    active: false,
    activationHash,
    created_at: created,
    updated_at: created,
  };
  await utils.validate.input(data);
  const database = db.getDatabase;
  const users = database.collection("users");
  const duplicate = await users.findOne({ email });
  if (duplicate) {
    throw "Email address already registered!";
  }
  await users.insertOne(data);
  await utils.mail.send(
    data.email,
    `${settings.appName} | Registration`,
    `<b>Welcome ${data.name}!</b>
    <br/>
    <br/>
    Successfully registered!
    <br/>
    <br/>
    Follow the link bellow to activate your account.
    <br/>
    ${clientUrl}/activation/${activationHash}`,
  );
  return activationHash;
};

export default {
  login,
  registration,
};
