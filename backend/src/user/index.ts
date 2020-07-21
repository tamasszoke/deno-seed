import profile from "./services/profile.ts";
import { log } from "../config/index.ts";

/**
 * Update user
 * @param ctx any
 */
const update = async (ctx: any) => {
  try {
    log.debug("Updating user...");
    const body = ctx.request.body();
    let {
      email,
      name,
      username,
      age,
      location,
    } = await body.value;
    if (!email || !name || !username || !age || !location) {
      throw "Missing parameters!";
    }
    const data: any = {
      email,
      name,
      username,
      age,
      location,
    };
    const user = await profile.update(data);
    log.debug("User update success!");
    const response = {
      service: "user",
      type: "profile",
      action: "update",
      success: true,
      user,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("User update failed!");
    const response = {
      service: "user",
      type: "profile",
      action: "update",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Remove user
 * @param ctx any
 */
const remove = async (ctx: any) => {
  try {
    log.debug("Removing user...");
    const body = ctx.request.body();
    let { email, password } = await body.value;
    if (!email || !password) {
      throw "Missing parameters!";
    }
    await profile.remove(email, password);
    log.debug("User remove success!");
    const response = {
      service: "user",
      type: "profile",
      action: "remove",
      success: true,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("User remove failed!");
    const response = {
      service: "user",
      type: "profile",
      action: "remove",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

export default {
  update,
  remove,
};
