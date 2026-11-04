import express from "express";
import {
  createMessage,
  getMyMessages,
  getMessageById,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login required to send a message
router.post("/", verifyToken, createMessage);

// Login required to view personal message history
router.get("/my-messages", verifyToken, getMyMessages);

// Login required to view single message detail
router.get("/:id", verifyToken, getMessageById);

export default router;

