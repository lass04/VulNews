import Router from "express";
import { getCirclCVE, getLatestCirclCVEs } from "../controllers/cve/circlCve.controller.js";
import { getLatestNvd , fetchAndStoreNvdCVEs,getCveById, searchCves } from "../controllers/cve/nvd.controller.js";
import { getLatestEpssCVEs, getEpssByCve } from "../controllers/cve/epssCve.controller.js";


const router = new Router();

router.route("/getCirclCve").get(getCirclCVE);
router.route("/getLatestCircl").get(getLatestCirclCVEs);
router.route("/getLatestNvd").get(getLatestNvd);
router.route("/getLatestEpss").get(getLatestEpssCVEs);
router.route("/getEpssByCve/:id").get(getEpssByCve);
router.route("/fetchAndstore").post(fetchAndStoreNvdCVEs);
router.route("/getCveById/:id").get(getCveById);
router.route("/search").get(searchCves);

export default router;