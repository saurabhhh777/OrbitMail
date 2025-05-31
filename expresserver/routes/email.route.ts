import express, { Request, RequestHandler, Response } from "express";

const router = express.Router();

import { sendEmail,getMail,addDomain } from "../controllers/email.controller";
import {userAuth} from "../middlewares/userAuth.middleware";



//saving the email to the database
router.route("/addDomain").post(userAuth, addDomain );

router.route("/sendEmail").post(userAuth ,sendEmail);

router.route("/getMail").get(getMail);



export default router;
// This file defines the routes for email-related operations in the Express server.