import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { startNvdCron } from "./cron/nvd.cron.js";

const startServer = async () => {
    
    try{

        await connectDB();
        startNvdCron();

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