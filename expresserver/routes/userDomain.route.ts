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
  sendOtpForEmailDeletion,
  verifyOtpAndDeleteEmail,
  sendOtpForDomainDeletion,
  verifyOtpAndDeleteDomain,
  getDomainAnalytics,
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

// OTP routes for email deletion
router.post('/send-otp', userAuth, sendOtpForEmailDeletion as unknown as RequestHandler);
router.post('/verify-otp-delete', userAuth, verifyOtpAndDeleteEmail as unknown as RequestHandler);

// OTP routes for domain deletion
router.post('/send-domain-otp', userAuth, sendOtpForDomainDeletion as unknown as RequestHandler);
router.post('/verify-domain-otp-delete', userAuth, verifyOtpAndDeleteDomain as unknown as RequestHandler);

// Domain analytics route
router.get('/:domainId/analytics', userAuth, getDomainAnalytics as unknown as RequestHandler);


export default router;