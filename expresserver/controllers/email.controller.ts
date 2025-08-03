import { Request, Response } from 'express';
import emailSentReceiveModel from '../models/emailSentReceive.model';
import userDomainModel from '../models/userDomain.model';
import userModel from '../models/user.model';
import bcryptjs from 'bcryptjs';
// Import email service manager
import emailServiceManager from '../services/emailService';

// Define the user type
interface User {
    id: string;
    email: string;
}

// Extend Express Request type to include user
interface AuthenticatedRequest extends Omit<Request, 'user'> {
    user: User;
}

interface MailRequestBody {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

interface MailResponseBody {
    message: string;
    success: boolean;
    emailDetails?: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html?: string;
    }
}

interface GetMailResponseBody {
    message: string;
    success: boolean;
    emails?: Array<{
        id: string;
        to: string;
        from: string;
        subject: string;
        text: string;
        html?: string;
        timestamp: Date;
        type: 'sent' | 'received';
    }>;
}

export const sendEmail = async (req: Request, res: Response) => {
    try {
        const { to, subject, text, html, from } = req.body;
        

        if (!to || !subject || !text || !from) {
            return res.status(400).json({
                message: "To, from, subject, and text are required",
                success: false,
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to) || !emailRegex.test(from)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }

        // Store email in database
        const newEmail = new emailSentReceiveModel({
            to,
            from,
            subject,
            text,
            html: html || undefined
        });

        await newEmail.save();

        // Send email using email service manager
        try {
            const jobId = await emailServiceManager.sendEmail(from, to, subject, text);
            
            return res.status(200).json({
                message: "Email sent successfully",
                success: true,
                jobId,
                emailDetails: {
                    to,
                    from,
                    subject,
                    text,
                    html: html || undefined
                },
            });
        } catch (emailError: any) {
            console.error("Email sending failed:", emailError);
            
            // Still return success since email is stored in database
            return res.status(200).json({
                message: "Email stored successfully. Sending may be delayed.",
                success: true,
                emailDetails: {
                    to,
                    from,
                    subject,
                    text,
                    html: html || undefined
                },
            });
        }

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getMail = async (req:Request, res: Response) => {
    try {
        const userEmail = req.body.email;

        if (!userEmail) {
            return res.status(400).json({
                message: "User email not found",
                success: false
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        // Find all emails where the user is either sender or receiver
        const emails = await emailSentReceiveModel.find({
            $or: [
                { from: userEmail },
                { to: userEmail }
            ]
        }).sort({ createdAt: -1 }).limit(100); // Sort by timestamp in descending order (newest first) and limit results

        if (!emails || emails.length === 0) {
            return res.status(200).json({
                message: "No emails found",
                success: true,
                emails: []
            });
        }

        // Transform the data to include type (sent/received)
        const formattedEmails = emails.map(email => ({
            id: email._id.toString(),
            to: email.to,
            from: email.from,
            subject: email.subject,
            text: email.text,
            html: email.html || undefined,
            timestamp: email.createdAt,
            type: (email.from === userEmail ? 'sent' : 'received') as 'sent' | 'received'
        }));

        return res.status(200).json({
            message: "Emails retrieved successfully",
            success: true,
            emails: formattedEmails
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const storeEmail = async (req: Request, res: Response) => {
    try {
        const { from, to, subject, text, html } = req.body;

        if (!from || !to || !subject || !text) {
            return res.status(400).json({
                message: "From, to, subject, and text are required",
                success: false
            });
        }

        const newEmail = new emailSentReceiveModel({
            from,
            to,
            subject,
            text,
            html: html || undefined
        });

        await newEmail.save();

        return res.status(200).json({
            message: "Email stored successfully",
            success: true
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getEmailAnalytics = async (req: Request, res: Response) => {
    try {
        const { email, period, startDate, endDate } = req.query;
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        if (!email || !period) {
            return res.status(400).json({
                message: "Email and period are required",
                success: false
            });
        }

        // Get user subscription to determine analytics access
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Calculate date range based on period
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
            case 'custom':
                if (!startDate || !endDate) {
                    return res.status(400).json({
                        message: "Start date and end date are required for custom period",
                        success: false
                    });
                }
                start = new Date(startDate as string);
                end = new Date(endDate as string);
                break;
            default:
                return res.status(400).json({
                    message: "Invalid period. Use: 1day, 7days, 30days, or custom",
                    success: false
                });
        }

        // Check if user has access to custom analytics (paid users only)
        if (period === 'custom' && user.subscription?.plan === 'free') {
            return res.status(403).json({
                message: "Custom date range analytics are only available for paid users",
                success: false
            });
        }

        // Get emails for the specified period
        const emails = await emailSentReceiveModel.find({
            $or: [
                { from: email },
                { to: email }
            ],
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).sort({ createdAt: -1 });

        // Calculate analytics
        const sentEmails = emails.filter(emailItem => emailItem.from === email as string);
        const receivedEmails = emails.filter(emailItem => emailItem.to === email as string);

        // Group by date for chart data
        const emailStats = emails.reduce((acc: any, emailItem) => {
            const date = emailItem.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { sent: 0, received: 0 };
            }
            if (emailItem.from === email as string) {
                acc[date].sent++;
            } else {
                acc[date].received++;
            }
            return acc;
        }, {});

        const chartData = Object.keys(emailStats).map(date => ({
            date,
            sent: emailStats[date].sent,
            received: emailStats[date].received
        }));

        res.json({
            message: "Email analytics retrieved successfully",
            success: true,
            analytics: {
                period,
                startDate: start,
                endDate: end,
                totalEmails: emails.length,
                sentEmails: sentEmails.length,
                receivedEmails: receivedEmails.length,
                chartData
            }
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getEmailServiceStatus = async (req: Request, res: Response) => {
    try {
        const status = emailServiceManager.getStatus();
        const queueStats = emailServiceManager.getQueueStats();
        
        res.json({
            message: "Email service status retrieved successfully",
            success: true,
            status,
            queueStats
        });
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getEmailJobStatus = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        const jobStatus = emailServiceManager.getJobStatus(jobId);
        
        if (!jobStatus) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        res.json({
            message: "Job status retrieved successfully",
            success: true,
            jobStatus
        });
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}