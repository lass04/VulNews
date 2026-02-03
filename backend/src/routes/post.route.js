import { Router } from "express";
import { createPost, deletePost, updatePost, getPosts, LikedPosts , insertMany , LikePost , UnlikePost , getPost} 
from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(authenticate,createPost);
router.route("/delete/:id").delete(authenticate,deletePost);
router.route("/update/:id").patch(authenticate,updatePost);
router.route("/getAll").get(getPosts);
router.route("/getPost/:id").get(getPost);
router.route("/likedPosts").get(LikedPosts); //authenticate
router.route("/insertMany").post(insertMany);
router.route("/likePost/:id").post(LikePost);  // authenticate
router.route("/UnlikePost/:id").post(UnlikePost);

export default router;