import { Router } from "express";
import { createUser, deleteUser, updateUser, getUsers} from "../controllers/user.controller.js";
import { authenticate , adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition
router.route("/create").post(createUser);
router.route("/delete").delete(authenticate,deleteUser);
router.route("/update/:id").patch(authenticate,updateUser);
router.route("/getAll").get(adminOnly,getUsers);

export default router;