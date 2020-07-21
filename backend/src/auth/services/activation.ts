import { bcrypt } from "../../../deps.ts";
import utils from "../../utils/index.ts";
import { db, settings } from "../../config/index.ts";

/**
 * Send new activation message
 * @param email string
 */
const send = async (email: string) => {
  const { clientUrl } = settings;
  const database = db.getDatabase;
  const users = database.collection("users");
  const user: any = await users.findOne({ email, active: false });
  if (!user) {
    throw "Not registered or already activated!";
  }
  let activationHash = await bcrypt.genSalt(10);
  activationHash = encodeURIComponent(activationHash).replaceAll(".", "");
  const updated = new Date().toISOString();
  const data = {
    activationHash,
    updated_at: updated,
  };
  await utils.validate.input(data);
  await users.updateOne({ email }, { $set: data });
  await utils.mail.send(
    email,
    `${settings.appName} | Activation`,
    `<b>Dear ${user.name}!</b>
    <br/>
    <br/>
    Follow the link bellow to activate your account.
    <br/>
    ${clientUrl}/activation/${activationHash}`,
  );
  return activationHash;
};

/**
 * Check if the hash is valid
 * @param hash string
 */
const check = async (hash: string) => {
  const database = db.getDatabase;
  const users = database.collection("users");
  let user: any = await users.findOne({ activationHash: hash, active: false });
  const { email } = user;
  if (!user || user.activationHash !== hash) {
    throw "Hash not valid!";
  }
  const updated = new Date().toISOString();
  const data = {
    active: true,
    activationHash: "",
    updated_at: updated,
  };
  await utils.validate.input(data);
  await users.updateOne({ email }, { $set: data });
  return true;
};

export default {
  send,
  check,
};
