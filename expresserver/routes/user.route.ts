import express, { RequestHandler } from "express";

const router = express.Router();
import { Signup, Signin, Signout, createEmail, checkAuth, checkAuthStatus } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth.middleware";

router.post("/signup" ,Signup as RequestHandler);
router.post("/signin",Signin as RequestHandler);
router.post("/signout",Signout as RequestHandler);
router.get("/check", userAuth, checkAuth as RequestHandler);
router.get("/check-status", checkAuthStatus as RequestHandler);

//create the email :
router.post("/cretaeEmail",createEmail as RequestHandler);

export default router;
