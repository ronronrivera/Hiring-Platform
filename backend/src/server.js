import express from "express";
import "dotenv/config"
import cors from "cors"
import path from "path"
import cookieParser from "cookie-parser";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import applicationRoutes from "./routes/application.routes.js"

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

if(!ENV.CLIENT_URL){
    console.log("CLIENT_URL was not defined!");
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/jobs", applicationRoutes);

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

//TODO: BOTH EMPLOYEE AND APPLICANT MUST BE ABLE TO READ THE JOB AND THE APPLICATION ✅

//TODO: IMPLEMENT A FEATURE THAT CHECKS APPLICATION STATUS TO READING IF EMPLOYEE ONLY READS THE APPLICATION, REJECTED IF EMPLOYEE CHOOSE THE REJECT OPTION (SENDING MESSAGE IS OPTIONAL), SHORTLISTED IF THE EMPLOYEE IS INTERESTED TO THE APPLICANT (MUST HAVE A MESSAGE INCLUDED WHEN EMPLOYEE CHOOSES THIS OPTION) 

//TODO: IMPLEMENT SEARCH QUERY WHERE JOBS GET FETCH DEPENDING ON WHAT THE USER SEARCH ✅

//TODO: A JOB MUST REQUIRED A SKILLS ✅
