import Router from "express";
import { createTool, deleteTool, updateTool, getTools , insertMany , getByCategory } from "../controllers/tool.controller.js";

const router = new Router();


router.route("/create").post(createTool);
router.route("/delete/:id").delete(deleteTool);
router.route("/update/:id").patch(updateTool);
router.route("/getAll").get(getTools);
router.route("/insertMany").post(insertMany);
router.route("/getByCategory/:id").get(getByCategory);

export default router;