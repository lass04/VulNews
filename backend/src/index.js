import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { fetchArticlesAndStore } from "./controllers/article.controller.js";
import { fetchAndStoreNvdCVEs } from "./controllers/cve/nvd.controller.js";

const startServer = async () => {
    
    try{

        await connectDB();
        //fetchArticlesAndStore();
        //fetchAndStoreNvdCVEs();

        app.on("Error",(err)=>{
            console.log(err)
        });

        app.listen(process.env.PORT || 4000 , ()=>{
            console.log(`Server running on port : ${process.env.PORT}`);
        });


    }catch(error){
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();