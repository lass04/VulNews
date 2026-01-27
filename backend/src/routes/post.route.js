import { Router } from "express";
import { createPost, deletePost, updatePost, getPosts, LikedPosts , insertMany , LikePost } 
from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(authenticate,createPost);
router.route("/delete").delete(authenticate,deletePost);
router.route("/update/:id").patch(authenticate,updatePost);
router.route("/getAll").get(getPosts);
router.route("/likedPosts").get(LikedPosts); //authenticate
router.route("/insertMany").post(insertMany);
router.route("/likePost/:id").post(LikePost)  // authenticate

export default router;