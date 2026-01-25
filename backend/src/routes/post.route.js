import { Router } from "express";
import { createPost, deletePost, updatePost, getPosts, LikedPosts , insertMany } from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(authenticate,createPost);
router.route("/delete").delete(authenticate,deletePost);
router.route("/update/:id").patch(authenticate,updatePost);
router.route("/getAll").get(getPosts);
router.route("/likedPosts").get(authenticate,LikedPosts);
router.route("/insertMany").post(insertMany);

export default router;