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
        // Get total users count
        const totalUsers = await userModel.countDocuments();
        
        // Get premium users count
        const premiumUsers = await userModel.countDocuments({
            'subscription.plan': { $ne: 'free' }
        });
        
        // Get free users count
        const freeUsers = totalUsers - premiumUsers;
        
        // Get total domains count
        const totalDomains = await userDomainModel.countDocuments();
        
        // Get total emails count
        const totalEmails = await emailSentReceiveModel.countDocuments();
        
        // Calculate revenue (assuming premium users pay $10/month)
        const monthlyRevenue = premiumUsers * 10;
        
        // Get user distribution for charts
        const userDistribution = [
            { name: 'Free Users', value: freeUsers, color: '#8884d8' },
            { name: 'Premium Users', value: premiumUsers, color: '#82ca9d' }
        ];
        
        // Get recent user registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentUsers = await userModel.find({
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 }).limit(10);
        
        res.json({
            message: "Admin dashboard data retrieved successfully",
            success: true,
            dashboard: {
                totalUsers,
                premiumUsers,
                freeUsers,
                totalDomains,
                totalEmails,
                monthlyRevenue,
                userDistribution,
                recentUsers: recentUsers.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    subscription: user.subscription
                }))
            }
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search = '', filter = 'all' } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        
        let query: any = {};
        
        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter functionality
        if (filter === 'premium') {
            query['subscription.plan'] = { $ne: 'free' };
        } else if (filter === 'free') {
            query['subscription.plan'] = 'free';
        }
        
        const users = await userModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        
        const totalUsers = await userModel.countDocuments(query);
        
        res.json({
            message: "Users retrieved successfully",
            success: true,
            users,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalUsers / Number(limit)),
                totalUsers,
                usersPerPage: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getDomains = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, search = '', filter = 'all' } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        
        let query: any = {};
        
        // Search functionality
        if (search) {
            query.domain = { $regex: search, $options: 'i' };
        }
        
        // Filter functionality
        if (filter === 'verified') {
            query.isVerified = true;
        } else if (filter === 'unverified') {
            query.isVerified = false;
        }
        
        const domains = await userDomainModel.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        
        const totalDomains = await userDomainModel.countDocuments(query);
        
        res.json({
            message: "Domains retrieved successfully",
            success: true,
            domains,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalDomains / Number(limit)),
                totalDomains,
                domainsPerPage: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get domains error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getEmailAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { period = '30days' } = req.query;
        
        // Calculate date range based on period
        let startDate: Date;
        const endDate = new Date();
        
        switch (period) {
            case '7days':
                startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        
        // Get email statistics
        const totalEmails = await emailSentReceiveModel.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        
        // Get emails by type (sent vs received)
        const sentEmails = await emailSentReceiveModel.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            from: { $exists: true, $ne: '' }
        });
        
        const receivedEmails = totalEmails - sentEmails;
        
        // Get daily email trends
        const dailyTrends = await emailSentReceiveModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        // Get top domains by email volume
        const topDomains = await emailSentReceiveModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$from",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);
        
        res.json({
            message: "Email analytics retrieved successfully",
            success: true,
            analytics: {
                period,
                startDate,
                endDate,
                totalEmails,
                sentEmails,
                receivedEmails,
                dailyTrends,
                topDomains
            }
        });
    } catch (error) {
        console.error("Email analytics error:", error);
        res.status(500).json({
            message: "Internal Server Error",
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