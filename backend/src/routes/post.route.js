import { Router } from "express";
import { createPost, deletePost, updatePost, getPosts} from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(authenticate,createPost);
router.route("/delete").delete(authenticate,deletePost);
router.route("/update/:id").patch(authenticate,updatePost);
router.route("/getAll").get(getPosts);

export default router;