import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model'; // Assuming you have a User model defined


export const Signup = async (req:Request, res:Response) => {
    try {
        console.log("Signup request body:", req.body);
        
        const {email,password,confirmpassword} = req.body;

        if ( !email || !password || !confirmpassword) {
            console.log("Missing fields:", { email: !!email, password: !!password, confirmpassword: !!confirmpassword });
            return res.status(400).json({ 
                message: "All fields are required",
                success:false    
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
                success: false,
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false,
            });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false,
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

        console.log("Signin Data from Signin route :");
        console.log(`email : ${email} , password : ${password}`);

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

    
        const user = await userModel.findOne({ email:email });

        console.log(`Signin from the backend : ${user}`);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }


        const isPasswordValid = bcryptjs.compareSync(password, user.password || '');

        console.log(`Password : ${isPasswordValid}`);

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

export const checkAuth = async (req:Request, res:Response) => {
    try {
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User authenticated",
            success: true,
            data: user,
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const checkAuthStatus = async (req:Request, res:Response) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User authenticated",
            success: true,
            data: user,
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(401).json({
            message: "Invalid token",
            success: false,
        });
    }
}