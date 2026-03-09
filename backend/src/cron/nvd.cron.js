import cron from "node-cron";
import { fetchAndStoreNvdCVEs } from "../controllers/cve/nvd.controller.js";

export const startNvdCron = () => {
  // Chaque jour à 11:54
  cron.schedule("54 11 * * *", async () => {
    await fetchAndStoreNvdCVEs();
  });

  console.log("⏰ NVD daily cron scheduled (12:39 UTC)");
};
