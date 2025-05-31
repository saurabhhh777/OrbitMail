import express, { Request, RequestHandler, Response } from "express";

const router = express.Router();

import { sendEmail,getMail } from "../controllers/email.controller";


router.route("/sendEmail").post(sendEmail as RequestHandler);

router.route("/getMail").get(getMail as RequestHandler);





export default router;
