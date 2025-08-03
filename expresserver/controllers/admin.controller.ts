import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../models/admin.model';
import userModel from '../models/user.model';
import userDomainModel from '../models/userDomain.model';
import emailSentReceiveModel from '../models/emailSentReceive.model';

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

// Get admin dashboard analytics
export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get total users
        const totalUsers = await userModel.countDocuments();
        
        // Get users by subscription plan
        const freeUsers = await userModel.countDocuments({ 'subscription.plan': 'free' });
        const basicUsers = await userModel.countDocuments({ 'subscription.plan': 'basic' });
        const premiumUsers = await userModel.countDocuments({ 'subscription.plan': 'premium' });
        
        // Get total domains
        const totalDomains = await userDomainModel.countDocuments();
        const verifiedDomains = await userDomainModel.countDocuments({ isVerified: true });
        
        // Get total emails
        const totalEmails = await emailSentReceiveModel.countDocuments();
        
        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentUsers = await userModel.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const recentEmails = await emailSentReceiveModel.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Get monthly subscription revenue
        const basicRevenue = basicUsers * 999; // ₹999 per month
        const premiumRevenue = premiumUsers * 1999; // ₹1999 per month
        const totalRevenue = basicRevenue + premiumRevenue;

        res.json({
            message: "Admin dashboard data retrieved successfully",
            success: true,
            dashboard: {
                users: {
                    total: totalUsers,
                    free: freeUsers,
                    basic: basicUsers,
                    premium: premiumUsers,
                    recent: recentUsers
                },
                domains: {
                    total: totalDomains,
                    verified: verifiedDomains
                },
                emails: {
                    total: totalEmails,
                    recent: recentEmails
                },
                revenue: {
                    basic: basicRevenue,
                    premium: premiumRevenue,
                    total: totalRevenue
                }
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({
            message: "Failed to get admin dashboard data",
            success: false
        });
    }
};

// Get users list with filters
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, plan, search } = req.query;
        
        const query: any = {};
        
        if (plan && plan !== 'all') {
            query['subscription.plan'] = plan;
        }
        
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await userModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const totalUsers = await userModel.countDocuments(query);

        res.json({
            message: "Users retrieved successfully",
            success: true,
            users,
            pagination: {
                current: Number(page),
                total: Math.ceil(totalUsers / Number(limit)),
                totalUsers
            }
        });

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            message: "Failed to get users",
            success: false
        });
    }
};

// Get domains list
export const getDomains = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, verified, search } = req.query;
        
        const query: any = {};
        
        if (verified !== undefined) {
            query.isVerified = verified === 'true';
        }
        
        if (search) {
            query.domain = { $regex: search, $options: 'i' };
        }

        const domains = await userDomainModel.find(query)
            .populate('userId', 'email name')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const totalDomains = await userDomainModel.countDocuments(query);

        res.json({
            message: "Domains retrieved successfully",
            success: true,
            domains,
            pagination: {
                current: Number(page),
                total: Math.ceil(totalDomains / Number(limit)),
                totalDomains
            }
        });

    } catch (error) {
        console.error("Get domains error:", error);
        res.status(500).json({
            message: "Failed to get domains",
            success: false
        });
    }
};

// Get email analytics for admin
export const getEmailAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { period = '30days' } = req.query;
        
        let start: Date, end: Date = new Date();
        
        switch (period) {
            case '1day':
                start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7days':
                start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const emails = await emailSentReceiveModel.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).sort({ createdAt: -1 });

        // Group by date
        const emailStats = emails.reduce((acc: any, email) => {
            const date = email.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { total: 0 };
            }
            acc[date].total++;
            return acc;
        }, {});

        const chartData = Object.keys(emailStats).map(date => ({
            date,
            total: emailStats[date].total
        }));

        res.json({
            message: "Email analytics retrieved successfully",
            success: true,
            analytics: {
                period,
                startDate: start,
                endDate: end,
                totalEmails: emails.length,
                chartData
            }
        });

    } catch (error) {
        console.error("Email analytics error:", error);
        res.status(500).json({
            message: "Failed to get email analytics",
            success: false
        });
    }
};

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