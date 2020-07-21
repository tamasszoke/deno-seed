import { Router } from "../../../deps.ts";
import user from "../../user/index.ts";

const router = new Router();

router.post("/api/user/profile/update", user.update);
router.delete("/api/user/profile/remove", user.remove);

export default router;
