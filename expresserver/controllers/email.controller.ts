import { Request, Response } from 'express';
import emailSentReceiveModel from '../models/emailSentReceive.model';
import userDomainModel from '../models/userDomain.model';
import bcryptjs from 'bcryptjs';

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

export const addDomain = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { domain, prefix, fullEmail, password } = req.body;

        if (!domain || !prefix || !fullEmail || !password) {
            return res.status(400).json({
                message: "Domain, prefix, fullEmail, and password are required",
                success: false,
            });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, please login",
                success: false,
            });
        }

        // Check if user already has 5 email addresses
        const existingDomain = await userDomainModel.findOne({ userId });
        if (existingDomain && existingDomain.emails.length >= 5) {
            return res.status(400).json({
                message: "Maximum limit of 5 email addresses reached",
                success: false,
            });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newEmail = {
            prefix,
            fullEmail,
            passwordHash
        };

        // Update or create domain
        const updatedDomain = await userDomainModel.findOneAndUpdate(
            { userId },
            {
                $push: { emails: newEmail },
                domain,
                isVerified: false
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Domain and email added successfully",
            success: true,
            domain: updatedDomain
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const sendEmail = async (req: AuthenticatedRequest, res: Response<MailResponseBody>) => {
    try {
        const { to, subject, text, html } = req.body;
        const from = req.user.email;

        if (!to || !subject || !text || !from) {
            return res.status(400).json({
                message: "To, from, subject, and text are required",
                success: false,
            });
        }

        const newEmail = new emailSentReceiveModel({
            to,
            from,
            subject,
            text,
            html: html || undefined
        });

        await newEmail.save();

        return res.status(200).json({
            message: "Email sent successfully",
            success: true,
            emailDetails: {
                to,
                from,
                subject,
                text,
                html: html || undefined
            },
        });

    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getMail = async (req: AuthenticatedRequest, res: Response<GetMailResponseBody>) => {
    try {
        const userEmail = req.user.email;

        if (!userEmail) {
            return res.status(400).json({
                message: "User email not found",
                success: false
            });
        }

        // Find all emails where the user is either sender or receiver
        const emails = await emailSentReceiveModel.find({
            $or: [
                { from: userEmail },
                { to: userEmail }
            ]
        }).sort({ createdAt: -1 }); // Sort by timestamp in descending order (newest first)

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