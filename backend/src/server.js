import express from "express";
import "dotenv/config"
import cors from "cors"
import path from "path"

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

if(!ENV.CLIENT_URL){
    console.log("CLIENT_URL was not defined!");
}

app.use(express.json());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", authRoutes);

if(!ENV.NODE_ENV){
    console.log("NODE_ENV was not defined");
}
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get(/.*/, (_, res) =>{
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

const startServer = async () =>{
    try{
        await connectDB();
        app.listen(PORT, () =>{
            console.log("App is listening to PORT: ", PORT);
        })
    }
    catch(error){

    }
}

startServer();

//TODO: IMPLEMENT A USER AUTHENTICATION USING JWT
