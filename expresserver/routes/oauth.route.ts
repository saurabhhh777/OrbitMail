import express, { RequestHandler } from "express";
import { googleAuth, githubAuth, appleAuth } from "../controllers/oauth.controller";

const router = express.Router();

// OAuth routes
router.post("/google", googleAuth as unknown as RequestHandler);
router.post("/github", githubAuth as unknown as RequestHandler);
router.post("/apple", appleAuth as unknown as RequestHandler);

export default router; 