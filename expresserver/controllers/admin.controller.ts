import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../models/admin.model';

export const adminSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingAdmin = await admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists",
                success: false,
            });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newAdmin = new admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        return res.status(201).json({
            message: "Admin registered successfully",
            success: true,
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
            }
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const adminUser = await admin.findOne({ email });
        if (!adminUser) {
            return res.status(400).json({
                message: "Admin not found",
                success: false,
            });
        }

        const isPasswordValid = bcryptjs.compareSync(password, adminUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }

        const token = jwt.sign({
            id: adminUser._id,
            role: 'admin'
        }, process.env.JWT_SECRET as string);

        return res.status(200).cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        }).json({
            message: "Admin logged in successfully",
            success: true,
            admin: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
            }
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const adminSignout = async (req: Request, res: Response) => {
    try {
        return res.status(200).cookie("adminToken", "").json({
            message: "Admin logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const createEmail = async (req:Request, res:Response) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Email Added Successfully",
            success: true,
            email: email,
        });
        

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }


}