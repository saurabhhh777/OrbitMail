import jwt from "jsonwebtoken";
import { Request, Response, NextFunction,RequestHandler } from "express";


//ye jwt payload hai jo humne sign kiya tha.
// Isko hum verify karte hai aur isme se user id nikalte hai.

interface  jwtPayload {
    id:string;
}


//express ki request epand kar hi hai.
declare module "express" {
    interface Request {
        id?: string; // Optional user property to hold the user ID    
    }

}


export const userAuth = (req:Request, res:Response, next:NextFunction):any=>{
    try {
        const token = req.cookies.token || req.headers.authorization;

        console.log("token from auth side:");
        console.log(token);

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized, please login",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;

        console.log("User id from Auth:");
        console.log(decoded);

        console.log(decoded.id);

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized, invalid token",
                success: false,
            });
        }

        req.id = decoded.id;

        console.log("req.user from the auth user :");
        console.log(req.id);


        next();


    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }

}