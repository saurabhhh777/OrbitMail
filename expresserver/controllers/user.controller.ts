import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model'; // Assuming you have a User model defined


export const Signup = async (req:Request, res:Response) => {
    try {

        const {email,password,confirmpassword} = req.body;

        if ( !email || !password || !confirmpassword) {
            return res.status(400).json({ 
                message: "All fields are required",
                success:false    
            });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }

        const doublePassword = bcryptjs.hashSync(password, 10);

        const newUser = new userModel({
            email,
            password: doublePassword,
        });


        await newUser.save();
        

        return res.status(201).json({
            message:"User registered successfully",
            success: true,
            user: {
                id: newUser._id,
                email: newUser.email,
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


export const Signin = async (req:Request,res:Response)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);

        if( !isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET as string, );



        console.log("Token from backend :");
        console.log(token);

        return res.status(200).cookie("token",token,{
            httpOnly: true,
            secure: false, // Use secure cookies in production
            sameSite: 'lax', // Helps prevent CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 day
        }).json({
            message: "User Sign in successfully",
            success: true,
            token:token,
            user: {
                id: user._id,
                email: user.email,
            }
        });
        
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message:"Internal Server Error",
            success: false,
        });
    }
}


export const Signout = async (req:Request, res:Response) => {
    try {

        return res.status(200).cookie("token", "").json({
            message: "User logged out successfully",
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