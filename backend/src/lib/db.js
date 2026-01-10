import { ENV } from "./env.js"
import mongoose from "mongoose"

export const connectDB = async () =>{
    try {
       if(mongoose.connection.readyState >= 1){
            console.log("MongoDB arleady connected");
            return;
        } 
        const conn = await mongoose.connect(ENV.DB_URI);
        console.log("✅ Connected to MongoDB: ", conn.connection.host)
    } catch (error) {
        console.log("❌ Failed to connect to MongoDB\n", error);
    }
}
