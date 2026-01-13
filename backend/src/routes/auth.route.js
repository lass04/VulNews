import Router from "express";
import { login, logout , refresh } from "../controllers/auth.controller.js";

const router = new Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refresh);

export default router;