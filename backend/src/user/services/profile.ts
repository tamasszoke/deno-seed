import utils from "../../utils/index.ts";
import { db, settings } from "../../config/index.ts";

/**
 * Update user
 * @param data any
 */
const update = async (data: any) => {
  const {
    email,
    name,
    username,
    age,
    location,
  } = data;
  const updated = new Date().toISOString();
  const updateData = {
    name,
    username,
    age,
    location,
    updated_at: updated,
  };
  await utils.validate.input(updateData);
  const database = db.getDatabase;
  const users = database.collection("users");
  await users.updateOne({ email, active: true }, { $set: updateData });
  return data;
};

/**
 * Remove user
 * @param email string
 * @param password string
 */
const remove = async (email: string, password: string) => {
  const user = await utils.validate.password(email, password, "remove");
  const database = db.getDatabase;
  const users = database.collection("users");
  await users.deleteOne({ email });
  await utils.mail.send(
    email,
    `${settings.appName} | Remove`,
    `<b>Dear ${user.name}!</b>
    <br/>
    <br/>
    Your profile has been successfully removed!`,
  );
  return true;
};

export default {
  update,
  remove,
};
