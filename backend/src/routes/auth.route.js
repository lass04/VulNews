import Router from "express";
import { login, logout , refresh , register } from "../controllers/auth.controller.js";

const router = new Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refresh);
router.route("/register").post(register);

export default router;