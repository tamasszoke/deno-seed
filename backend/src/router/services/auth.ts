import { Router } from "../../../deps.ts";
import auth from "../../auth/index.ts";

const router = new Router();

router.get("/api/auth/status", auth.status);
router.post("/api/auth/local/login", auth.local.login);
router.put("/api/auth/local/register", auth.local.register);
router.post("/api/auth/logout", auth.logout);
router.post("/api/auth/activation/send", auth.activation.send);
router.post("/api/auth/activation/check", auth.activation.check);
router.post("/api/auth/recovery/send", auth.recovery.send);
router.post("/api/auth/recovery/check", auth.recovery.check);

export default router;
