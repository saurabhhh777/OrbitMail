// userDomain.route.ts
import express, { RequestHandler } from 'express';
import {
  addDomain,
  VerifyMXRec,
  getallDomains,
  getMxRecords,
  addEmailPrefix,
  removeEmailPrefix,
  getEmailPrefixes,
} from '../controllers/userDomain.controller';
import { userAuth } from '../middlewares/userAuth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(userAuth);

// Domain routes
router.post('/',userAuth, addDomain as RequestHandler);
router.get('/:domainId/mx-records', userAuth, getMxRecords as unknown as RequestHandler);
router.post("/verifymxrec", VerifyMXRec as unknown as RequestHandler);
router.get('/',userAuth, getallDomains as RequestHandler);

// Email prefix routes
router.post('/:id/emails', userAuth, addEmailPrefix as unknown as RequestHandler);
router.delete('/:id/emails/:prefix', userAuth, removeEmailPrefix as unknown as RequestHandler);
router.get('/:id/emails', userAuth, getEmailPrefixes as unknown as RequestHandler);


export default router;