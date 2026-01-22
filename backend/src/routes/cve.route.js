import Router from "express";
import { getCirclCVE, getLatestCirclCVEs } from "../controllers/cve/circlCve.controller.js";
import { getLatestNvd , fetchAndStoreNvdCVEs } from "../controllers/cve/nvd.controller.js";
import { getLatestEpssCVEs } from "../controllers/cve/epssCve.controller.js";

const router = new Router();

router.route("/getCirclCve").get(getCirclCVE);
router.route("/getLatestCircl").get(getLatestCirclCVEs);
router.route("/getLatestNvd").get(getLatestNvd);
router.route("/getLatestEpss").get(getLatestEpssCVEs);
router.route("/fetchAndstore").post(fetchAndStoreNvdCVEs);

export default router;