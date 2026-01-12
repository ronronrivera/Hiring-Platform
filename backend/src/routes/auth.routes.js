import express from "express";
import { Login, Logout,  SetupProfile,  Signup, getProfile, refreshToken } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../lib/uploadFile.js";
import checkProfileSetup from "../middleware/checkProfileSetup.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login",Login);
router.post("/logout", Logout);

router.post("/refresh-token", refreshToken);

router.post("/setup-profile", protectRoute, upload.single("avatars"), SetupProfile);

router.get("/profile", protectRoute, checkProfileSetup  ,getProfile);


export default router;
