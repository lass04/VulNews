import { Router } from "express";
import { createUser, deleteUser, updateUser, getUsers, insertMany, getUserById } from "../controllers/user.controller.js";
import { authenticate , adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(createUser);
router.route("/delete").delete(authenticate,deleteUser);
router.route("/update/:id").patch(authenticate,updateUser);
router.route("/getAll").get(getUsers);
router.route("/insertMany").post(insertMany);
router.route("/getById/:id").get(getUserById);

export default router;