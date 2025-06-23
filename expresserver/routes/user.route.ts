import express, { RequestHandler } from "express";

const router = express.Router();
import { Signup, Signin, Signout, createEmail } from "../controllers/user.controller";

router.post("/signup" ,Signup as RequestHandler);
router.post("/signin",Signin as RequestHandler);
router.post("/signout",Signout as RequestHandler);

//create the email :
router.post("/cretaeEmail",createEmail as RequestHandler);

export default router;
