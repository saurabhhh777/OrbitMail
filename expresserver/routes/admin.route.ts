import express, { RequestHandler } from "express";

const router = express.Router();
import { 
  adminSignup, 
  adminSignin, 
  adminSignout, 
  createEmail,
  getAdminDashboard,
  getUsers,
  getDomains,
  getEmailAnalytics
} from "../controllers/admin.controller";
import { adminAuth } from "../middlewares/adminAuth.middleware";

// Authentication routes
router.route("/signup").post(adminSignup as RequestHandler);
router.route("/signin").post(adminSignin as RequestHandler);
router.route("/signout").post(adminSignout as RequestHandler);

// Admin dashboard routes (protected)
router.get("/dashboard", adminAuth, getAdminDashboard as any);
router.get("/users", adminAuth, getUsers as any);
router.get("/domains", adminAuth, getDomains as any);
router.get("/email-analytics", adminAuth, getEmailAnalytics as any);

//create the email :
router.route("/cretaeEmail").post(createEmail as RequestHandler);

export default router;
