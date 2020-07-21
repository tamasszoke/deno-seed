/**
 * Check if the user is logged in
 * @param ctx any
 */
const status = async (ctx: any) => {
  let user = {};
  if (ctx.session) {
    user = await ctx.session.get("user");
  } else {
    user = await ctx.state.session.get("user");
  }
  if (user) {
    return user;
  } else {
    throw "Not authenticated!";
  }
};

/**
 * Logging out
 * @param ctx any
 */
const logout = async (ctx: any) => {
  let user = {};
  if (ctx.session) {
    user = await ctx.session.get("user");
  } else {
    user = await ctx.state.session.get("user");
  }
  if (user) {
    await ctx.state.session.set("user", null);
    return true;
  } else {
    throw "Not logged in!";
  }
};

export default {
  status,
  logout,
};
