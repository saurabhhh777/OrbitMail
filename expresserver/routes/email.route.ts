import express, { RequestHandler} from "express";

const router = express.Router();

import { sendEmail,getMail } from "../controllers/email.controller";
import {userAuth} from "../middlewares/userAuth.middleware";




router.post("/sendEmail",userAuth,sendEmail as RequestHandler);

router.get("/getMail" ,userAuth, getMail as RequestHandler);



export default router;
// This file defines the routes for email-related operations in the Express server.