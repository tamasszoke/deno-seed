import { log } from "../config/index.ts";
import recovery from "./services/recovery.ts";
import activation from "./services/activation.ts";
import local from "./services/local.ts";
import common from "./services/common.ts";

let auth: any = { local: {}, activation: {}, recovery: {} };

/**
 * Check if user is authenticated
 * @param ctx any
 */
auth.status = async (ctx: any) => {
  try {
    log.debug("Checking user auth status...");
    const user = await common.status(ctx);
    log.debug("Authenticated!");
    const response = {
      service: "auth",
      type: "status",
      action: "check",
      success: true,
      user,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.debug("Check failed!");
    const response = {
      service: "auth",
      type: "status",
      action: "check",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Authenticate user
 * @param ctx any
 */
auth.local.login = async (ctx: any) => {
  try {
    log.debug("Logging in...");
    const body = ctx.request.body();
    let { email, password } = await body.value;
    if (!email || !password) {
      throw "Missing parameters!";
    }
    const user = await local.login(email, password);
    if (ctx.session) {
      await ctx.session.set("user", user);
    } else {
      await ctx.state.session.set("user", user);
    }
    log.debug("Login success!");
    const response = {
      service: "auth",
      type: "local",
      action: "login",
      success: true,
      user,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("Login failed!");
    const response = {
      service: "auth",
      type: "local",
      action: "login",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Registering user
 * @param ctx any
 */
auth.local.register = async (ctx: any) => {
  try {
    log.debug("Registering...");
    const body = ctx.request.body();
    let { email, password, name, username } = await body.value;
    if (!email || !password || !name || !username) {
      throw "Missing parameters!";
    }
    let hash = await local.registration(email, password, name, username);
    log.debug("Register success!");
    const response = {
      service: "auth",
      type: "local",
      action: "register",
      success: true,
      hash, // For testing
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("Register failed!");
    const response = {
      service: "auth",
      type: "local",
      action: "register",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Logging user out
 * @param ctx any
 */
auth.logout = async (ctx: any) => {
  try {
    log.debug("Logging out...");
    await common.logout(ctx);
    log.debug("Logout success!");
    const response = {
      service: "auth",
      type: "logout",
      action: "logout",
      success: true,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("Logout failed!");
    const response = {
      service: "auth",
      type: "logout",
      action: "logout",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Send activation message
 * @param ctx any
 */
auth.activation.send = async (ctx: any) => {
  try {
    log.debug("Sending activation message...");
    const body = ctx.request.body();
    let { email } = await body.value;
    if (!email) {
      throw "Missing parameters!";
    }
    const hash = await activation.send(email);
    log.debug("Message send success!");
    const response = {
      service: "auth",
      type: "activation",
      action: "send",
      success: true,
      hash,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("Message send failed!");
    const response = {
      service: "user",
      type: "activation",
      action: "send",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Activating user
 * @param ctx any
 */
auth.activation.check = async (ctx: any) => {
  try {
    log.debug("Activating user...");
    const body = ctx.request.body();
    let { hash } = await body.value;
    if (!hash) {
      throw "Missing parameters!";
    }
    await activation.check(hash);
    log.debug("User activation success!");
    const response = {
      service: "auth",
      type: "activation",
      action: "check",
      success: true,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("User activation failed!");
    const response = {
      service: "auth",
      type: "activation",
      action: "check",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Send recovery message
 * @param ctx any
 */
auth.recovery.send = async (ctx: any) => {
  try {
    log.debug("Sending recovery message...");
    const body = ctx.request.body();
    let { email } = await body.value;
    if (!email) {
      throw "Missing parameters!";
    }
    const hash = await recovery.send(email);
    log.debug("Message send success!");
    const response = {
      service: "auth",
      type: "recovery",
      action: "send",
      success: true,
      hash,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("Message send failed!");
    const response = {
      service: "auth",
      type: "recovery",
      action: "send",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

/**
 * Recovering user
 * @param ctx any
 */
auth.recovery.check = async (ctx: any) => {
  try {
    log.debug("Recovering user...");
    const body = ctx.request.body();
    let { hash, password } = await body.value;
    if (!hash || !password) {
      throw "Missing parameters!";
    }
    await recovery.check(hash, password);
    log.debug("User recovery success!");
    const response = {
      service: "auth",
      type: "recovery",
      action: "check",
      success: true,
    };
    ctx.response.body = JSON.stringify(response);
  } catch (error) {
    error = error.toString();
    log.warning(error);
    log.debug("User recovery failed!");
    const response = {
      service: "auth",
      type: "recovery",
      action: "check",
      success: false,
      error,
    };
    ctx.response.body = JSON.stringify(response);
  }
};

export default auth;
