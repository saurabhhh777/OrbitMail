import express, { RequestHandler } from "express";

const router = express.Router();
import { Signup , Signin , Signout,createEmail } from "../controllers/user.controller";



router.route("/signup").post(Signup as RequestHandler);
router.route("/signin").post(Signin as RequestHandler);
router.route("/signout").post(Signout as RequestHandler);


//create the email :
router.route("/cretaeEmail").post(createEmail as RequestHandler);


export default router;
