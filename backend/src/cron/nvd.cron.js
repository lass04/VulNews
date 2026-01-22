import cron from "node-cron";
import { fetchAndStoreNvdCVEs } from "../controllers/cve/nvd.controller.js";

export const startNvdCron = () => {
  // Runs every day at 02:00 AM UTC
  cron.schedule("09 23 * * *", async () => {
    await fetchAndStoreNvdCVEs();
  });

  console.log("⏰ NVD daily cron scheduled (12:39 UTC)");
};
