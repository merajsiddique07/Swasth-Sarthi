import express from "express";
import { registerUser, loginUser ,getProfile} from "../controllers/authController.js";
import upload  from "../middleware/UploadMiddleware.js";
import {protect} from "../middleware/authmiddleware.js"

const router = express.Router();

router.post("/register", upload.single("prescription"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;
