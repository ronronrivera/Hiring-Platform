import express from "express";

import { allApplications, 
        checkExistingApplication,
        readApplication, 
        sendApplication, 
        sendMessageToApplication} from "../controllers/application.controller.js";

import protectRoute from "../middleware/protectRoute.js";
import checkProfileSetup from "../middleware/checkProfileSetup.js";

const router = express.Router();

router.post("/:id/apply", protectRoute, checkProfileSetup, sendApplication);
router.post("/:id/send-message", protectRoute, checkProfileSetup, sendMessageToApplication);

router.get("/applications", protectRoute, checkProfileSetup, allApplications);
router.get("/application/:id", protectRoute, checkProfileSetup, readApplication);


router.get("/check/:id", protectRoute, checkProfileSetup, checkExistingApplication)


export default router;
