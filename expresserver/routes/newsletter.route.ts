import express, { RequestHandler } from 'express';
import { subscribeToNewsletter } from '../controllers/newsletter.controller.js';

const router = express.Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', subscribeToNewsletter as RequestHandler);

export default router; 