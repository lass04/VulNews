import mongoose from "mongoose";

export const connectDB = async () => {
    
    try{

        const connectionInstance = mongoose.connect(process.env.MOGODB_URI);
        console.log(`Successfully Connected\n Host: ${connectionInstance.connection.host}`);

    }catch(error){
        console.log(`Failed to connect to MongoDB \ error : ${error.message}`);
    }
}

