import cron from "node-cron";
import { fetchAndStoreLatestNvdCVEs } from "../controllers/cve/nvd.controller.js";

export const startNvdCron = () => {
  // Runs every day at 02:00 AM UTC
  cron.schedule("39 12 * * *", async () => {
    await fetchAndStoreLatestNvdCVEs();
  });

  console.log("⏰ NVD daily cron scheduled (02:00 UTC)");
};
