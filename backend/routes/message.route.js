import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import {
  handleGetUsers,
  handleGetMessages,
  handleSendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, handleGetUsers);
router.get("/:id", protectRoute, handleGetMessages);
router.post("/send/:id", protectRoute, handleSendMessage);

export default router;
