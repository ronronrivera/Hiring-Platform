import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { deleteJobById, getAllJobs, getJobById, postJob } from "../controllers/jobs.controller.js";
import checkProfileSetup from "../middleware/checkProfileSetup.js";

const router = express.Router();

router.post("/post-job", protectRoute, checkProfileSetup,postJob)

router.get("/get-jobs", protectRoute, checkProfileSetup ,getAllJobs);
router.get("/get-job/:id", protectRoute, checkProfileSetup ,getJobById);

router.delete("/delete-job/:id", protectRoute, checkProfileSetup,deleteJobById);

export default router;
