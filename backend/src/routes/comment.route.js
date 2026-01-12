import { Router } from "express";
import { createComment, deleteComment, updateComment, getComments} from "../controllers/comment.controller.js";
import{ authenticate } from "../middlewares/auth.middleware.js";


const router = new Router();

// Routes Definition

router.route("/create").post(authenticate,createComment);
router.route("/delete").delete(authenticate,deleteComment);
router.route("/update/:id").patch(authenticate,updateComment);
router.route("/getAll").get(authenticate,getComments);

export default router;