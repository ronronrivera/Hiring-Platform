import express from "express";
import "dotenv/config"
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import applicationRoutes from "./routes/application.routes.js";

import serverless from "serverless-http"; // optional

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationRoutes);

// Optional: serve frontend if in production and running locally
if (!ENV.SERVERLESS && ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get(/.*/, (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// Dynamic: local server vs serverless
if (!ENV.SERVERLESS) {
    // Run normal server for local testing
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log("App listening on PORT:", PORT);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    };
    startServer();
}
// Export for serverless platforms like Vercel
export default serverless(app);

