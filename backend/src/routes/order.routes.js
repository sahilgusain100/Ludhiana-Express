
import express from "express";
import {
  createOrder,
  getMyOrders,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login required to place an order
router.post("/", verifyToken, createOrder);

// Login required to view personal order history
router.get("/my-orders", verifyToken, getMyOrders);

export default router;
