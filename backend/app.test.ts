Deno.env.set("env", "test");

import { superoak } from "https://deno.land/x/superoak@2.0.0/mod.ts";
import { settings } from "./src/config/index.ts";
import { app } from "./app.ts";

declare global {
  var activationHash: string;
  var recoveryHash: string;
}

const sanitizeResources = false;
const sanitizeOps = false;

Deno.test({
  name: "[APP] server listening",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/").expect(200).expect("ready");
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth status",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/api/auth/status")
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "status" ||
          data.action !== "check"
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth local register",
  fn: async () => {
    const request = await superoak(app);
    await request.put("/api/auth/local/register")
      .send({
        "email": settings.emailAddress,
        "password": "12345",
        "name": "John Doe",
        "username": "johndoe",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        globalThis.activationHash = data.hash;
        if (
          data.service !== "auth" || data.type !== "local" ||
          data.action !== "register" || data.error
        ) {
          throw Error("Bad response!");
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth local register error",
  fn: async () => {
    const request = await superoak(app);
    await request.put("/api/auth/local/register")
      .send({
        "email": settings.emailAddress,
        "password": "12345",
        "name": "John Doe",
        "username": "johndoe",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "local" ||
          data.action !== "register" || !data.error
        ) {
          throw Error("Bad response!");
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth activation check",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/activation/check")
      .send({
        "hash": globalThis.activationHash,
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "activation" ||
          data.action !== "check" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth activation check error",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/activation/check")
      .send({
        "hash": "",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "activation" ||
          data.action !== "check" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth local login",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/local/login")
      .send({
        "email": settings.emailAddress,
        "password": "12345",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "local" ||
          data.action !== "login" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth local login error",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/local/login")
      .send({
        "email": settings.emailAddress,
        "password": "1234567",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "local" ||
          data.action !== "login" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth logout",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/logout")
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "logout" ||
          data.action !== "logout"
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth recovery send",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/recovery/send")
      .send({
        "email": settings.emailAddress,
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        globalThis.recoveryHash = data.hash;
        if (
          data.service !== "auth" || data.type !== "recovery" ||
          data.action !== "send" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth recovery send error",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/recovery/send")
      .send({
        "email": "",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "recovery" ||
          data.action !== "send" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth recovery check",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/recovery/check")
      .send({
        "hash": globalThis.recoveryHash,
        "password": "123456",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "recovery" ||
          data.action !== "check" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] auth recovery check error",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/auth/recovery/check")
      .send({
        "email": settings.emailAddress,
        "hash": "",
        "password": "123456",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "auth" || data.type !== "recovery" ||
          data.action !== "check" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] user update",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/user/profile/update")
      .send({
        "email": settings.emailAddress,
        "password": "123456",
        "name": "JaneDoe",
        "username": "janedoe",
        "age": "31-40",
        "location": "Budapest",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "user" || data.type !== "profile" ||
          data.action !== "update" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] user update error",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/api/user/profile/update")
      .send({
        "email": settings.emailAddress,
        "password": "123456789",
        "name": "Jane Doe",
        "username": "janedoe",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "user" || data.type !== "profile" ||
          data.action !== "update" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] user remove",
  fn: async () => {
    const request = await superoak(app);
    await request.delete("/api/user/profile/remove")
      .send({
        "email": settings.emailAddress,
        "password": "123456",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "user" || data.type !== "profile" ||
          data.action !== "remove" || data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});

Deno.test({
  name: "[APP] user remove error",
  fn: async () => {
    const request = await superoak(app);
    await request.delete("/api/user/profile/remove")
      .send({
        "email": settings.emailAddress,
        "password": "123456",
      })
      .expect("Content-Type", /text/)
      .expect(200)
      .expect((res: any) => {
        const data = JSON.parse(res.text);
        if (
          data.service !== "user" || data.type !== "profile" ||
          data.action !== "remove" || !data.error
        ) {
          throw Error(data.error);
        }
      });
  },
  sanitizeResources,
  sanitizeOps,
});
