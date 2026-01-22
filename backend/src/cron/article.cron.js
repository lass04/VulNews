import cron from "node-cron";
import { fetchArticlesAndStore } from "../controllers/article.controller.js";

export const startArticleCron = () => {
    cron.schedule("30 20 * * *", async () => {
        await fetchArticlesAndStore();
    });
}