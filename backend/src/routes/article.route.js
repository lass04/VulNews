import { Router } from "express";
import { createArticle, deleteArticle, updateArticle, getArticles} from "../controllers/article.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(adminOnly,createArticle);
router.route("/delete").delete(adminOnly,deleteArticle);
router.route("/update/:id").patch(adminOnly,updateArticle);
router.route("/getAll").get(adminOnly,getArticles);

export default router;