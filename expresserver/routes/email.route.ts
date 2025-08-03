import express from "express";
import { sendEmail, getMail, storeEmail, getEmailAnalytics, getEmailServiceStatus, getEmailJobStatus } from "../controllers/email.controller";
import { userAuth } from "../middlewares/userAuth.middleware";

const router = express.Router();

// Email sending and retrieval routes
router.post("/send", userAuth, sendEmail as any);
router.post("/get", userAuth, getMail as any);
router.post("/store", storeEmail as any); // For SMTP server to store incoming emails
router.get("/analytics", userAuth, getEmailAnalytics as any);

// Email service status routes
router.get("/service/status", getEmailServiceStatus as any);
router.get("/job/:jobId", getEmailJobStatus as any);

export default router;