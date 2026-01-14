import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { deleteJobById,  
        getAllEmployeeJobs,  
        getAllJobs,  
        getEmployeeJobById, 
        getJobById,  patchJobStatusById, 
        postJob
        } from "../controllers/jobs.controller.js";

import checkProfileSetup from "../middleware/checkProfileSetup.js";
import { allApplications, 
        checkExistingApplication,
        readApplication, 
        sendApplication } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/post-job", protectRoute, checkProfileSetup,postJob)

router.get("/get-my-jobs", protectRoute, checkProfileSetup ,getAllEmployeeJobs);
router.get("/get-my-job/:id", protectRoute, checkProfileSetup ,getEmployeeJobById);

router.get("/get-jobs", protectRoute, checkProfileSetup ,getAllJobs);
router.get("/get-job/:id", protectRoute, checkProfileSetup ,getJobById);


router.delete("/delete-job/:id", protectRoute, checkProfileSetup,deleteJobById);

router.patch("/patch-job/:id", protectRoute, checkProfileSetup, patchJobStatusById);

/*----------------> FOR APPLICATION ROUTES <-----------------------*/

router.post("/:id/apply", protectRoute, checkProfileSetup, sendApplication);

router.get("/applications", protectRoute, checkProfileSetup, allApplications);
router.get("/application/:id", protectRoute, checkProfileSetup, readApplication);

router.get("/check/:id", protectRoute, checkProfileSetup, checkExistingApplication)

export default router;
