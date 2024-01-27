import express from "express";
import { registerUser, loginUser, sendOtp, verifyOtp, updateUser } from "../Controllers/AuthControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/updateuser", updateUser);
export default router;