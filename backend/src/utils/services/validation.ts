import { validate, bcrypt } from "../../../deps.ts";
import userSchema from "../../user/user.model.ts";
import { db } from "../../config/index.ts";
import utils from "../../utils/index.ts";

/**
 * Validate user object to the shema of the user
 * @param user object
 */
const input = async (user: object) => {
  const [passes, errors] = await validate(user, userSchema);
  if (passes) {
    return true;
  } else {
    throw JSON.stringify(errors);
  }
};

/**
 * Validate user password, check if the stored
 * @param email string
 * @param password string
 */
const password = async (email: string, password: string, type: string) => {
  await utils.validate.input({ email, password });
  const database = db.getDatabase;
  const users = database.collection("users");
  const user: any = await users.findOne({ email });
  if (!user) {
    throw "User not found!";
  }
  if (user && !user.active && type !== "remove") {
    throw "User not activated!";
  }
  const hash = await bcrypt.hash(password, user.salt);
  if (user.password === hash) {
    const {
      email,
      name,
      username,
      admin,
      active,
      updated_at,
      activationHash,
    } = user;
    const data: any = {
      email,
      name,
      username,
      admin,
      active,
      updated_at,
      activationHash,
    };
    return data;
  } else {
    throw "Wrong password!";
  }
};

/**
 * Validate email address
 * @param email string
 */
const email = (email: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default {
  input,
  password,
  email,
};
