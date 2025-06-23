// userDomain.route.ts
import express, { RequestHandler } from 'express';
import {
  addDomain,
  VerifyMXRec,
  getallDomains,
  
} from '../controllers/userDomain.controller';
import { userAuth } from '../middlewares/userAuth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(userAuth);

// Domain routes
router.post('/', addDomain as RequestHandler);
router.post("/verifymxrec", VerifyMXRec as unknown as RequestHandler);
router.get('/', getallDomains as RequestHandler);


export default router;