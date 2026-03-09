import cron from "node-cron";
import { fetchArticlesAndStore } from "../controllers/article.controller.js";

export const startArticleCron = () => {
    // Chaque jour à 12:52
    cron.schedule("52 12 * * *", async () => {
        await fetchArticlesAndStore();
    });
}