import { Router } from "express";
import { createUser, deleteUser, updateUser, getUsers} from "../controllers/user.controller.js";

const router = new Router();


// Routes Definition
router.route("/create").post(createUser);
router.route("/delete").delete(deleteUser);
router.route("/update/:id").patch(updateUser);
router.route("/getAll").get(getUsers);

export default router;