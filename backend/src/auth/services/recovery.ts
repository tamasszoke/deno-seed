import { bcrypt } from "../../../deps.ts";
import { db, settings } from "../../config/index.ts";
import utils from "../../utils/index.ts";

/**
 * Send hash to recover the account
 * @param email string
 */
const send = async (email: string) => {
  const { url } = settings;
  let hash = await bcrypt.genSalt(10);
  hash = encodeURIComponent(hash).replaceAll(".", "");
  const updated = new Date().toISOString();
  const data = {
    recoveryHash: hash,
    updated_at: updated,
  };
  await utils.validate.input(data);
  const database = db.getDatabase;
  const users = database.collection("users");
  await users.updateOne({ email }, { $set: data });
  let user: any = await users.findOne({ email });
  await utils.mail.send(
    email,
    `${settings.appName} | Recovery`,
    `<b>Dear ${user.name}!</b>
    <br/>
    <br/>
    Follow the link bellow to recover the access to your account.
    <br/>
    ${url}/recovery/${hash}`,
  );
  return hash;
};

/**
 * Check if the hash is valid
 * @param hash string
 * @param password string
 */
const check = async (hash: string, password: string) => {
  const database = db.getDatabase;
  const users = database.collection("users");
  let user: any = await users.findOne({ recoveryHash: hash });
  const salt = await bcrypt.genSalt(8);
  const passwordHash = await bcrypt.hash(password, salt);
  const updated = new Date().toISOString();
  const data = {
    salt,
    password: passwordHash,
    recoveryHash: "",
    updated_at: updated,
  };
  await utils.validate.input(data);
  await users.updateOne({ email: user.email }, { $set: data });
  return true;
};

export default {
  send,
  check,
};
