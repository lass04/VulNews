import { Router } from "express";
import { createArticle, deleteArticle, updateArticle, getArticles, insertMany, getByCategory, getById} 
from "../controllers/article.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(adminOnly,createArticle);
router.route("/delete").delete(adminOnly,deleteArticle);
router.route("/update/:id").patch(adminOnly,updateArticle);
router.route("/getAll").get(getArticles);
router.route("/insertMany").post(insertMany);
router.route("/getByCategory/:id").get(getByCategory);
router.route("/getById/:id").get(getById);

export default router;