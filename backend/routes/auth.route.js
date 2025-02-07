import express from "express";
import {
  handleSignUp,
  handleLogin,
  handleLogout,
  handleUpdateProfile,
  handleCheck,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/update-profile", protectRoute, handleUpdateProfile);
router.get("/check", protectRoute, handleCheck); //calls when application restart or page reloads

export default router;
