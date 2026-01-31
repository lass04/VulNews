import { Router } from "express";
import { createComment, deleteComment, updateComment, getPostComments , insertMany }
from "../controllers/comment.controller.js";
import{ authenticate } from "../middlewares/auth.middleware.js";


const router = new Router();

// Routes Definition

router.route("/create").post(authenticate,createComment);
router.route("/delete/:id").delete(authenticate,deleteComment);
router.route("/update/:id").patch(authenticate,updateComment);
router.route("/getPostComments/:id").get(authenticate,getPostComments);
router.route("/insertMany").post(insertMany);

export default router;