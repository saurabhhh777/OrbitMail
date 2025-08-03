import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    id: string;
    role: string;
}

declare module "express" {
    interface Request {
        adminId?: string;
    }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized, please login as admin",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded || decoded.role !== 'admin') {
            return res.status(401).json({
                message: "Unauthorized, admin access required",
                success: false,
            });
        }

        req.adminId = decoded.id;
        next();

    } catch (error) {
        console.log("Admin auth error:", error);
        res.status(401).json({
            message: "Invalid admin token",
            success: false,
        });
    }
}; 