import Router from "express";
import { getCirclCVE, getLatestCirclCVEs } from "../controllers/cve/circlCve.controller.js";
import { getLatestNvdCVEs } from "../controllers/cve/nvdCve.controller.js";
import { getLatestEpssCVEs } from "../controllers/cve/epssCve.controller.js";

const router = new Router();

router.route("/getCirclCve").get(getCirclCVE);
router.route("/getLatestCircl").get(getLatestCirclCVEs);
router.route("/getLatestNvd").get(getLatestNvdCVEs);
router.route("/getLatestEpss").get(getLatestEpssCVEs);

export default router;