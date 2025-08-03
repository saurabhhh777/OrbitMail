import express, { RequestHandler } from "express";
import { 
  createPaymentOrder, 
  verifyPayment, 
  getSubscriptionPlans, 
  getUserSubscription 
} from "../controllers/payment.controller";
import { userAuth } from "../middlewares/userAuth.middleware";

const router = express.Router();

// Payment routes
router.post("/create-order", userAuth, createPaymentOrder as unknown as RequestHandler);
router.post("/verify", userAuth, verifyPayment as unknown as RequestHandler);
router.get("/plans", getSubscriptionPlans as unknown as RequestHandler);
router.get("/subscription", userAuth, getUserSubscription as unknown as RequestHandler);

export default router; 