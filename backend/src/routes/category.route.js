import { Router } from "express";
import { createCategory, deleteCategory, updateCategory, getCategories} from "../controllers/category.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();


// Routes Definition

router.route("/create").post(adminOnly,createCategory);
router.route("/delete").delete(adminOnly,deleteCategory);
router.route("/update/:id").patch(adminOnly,updateCategory);
router.route("/getAll").get(getCategories);

export default router;