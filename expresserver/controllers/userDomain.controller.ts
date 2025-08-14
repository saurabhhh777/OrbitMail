// userDomain.controller.ts
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import * as dns from "dns";
import {promisify} from "util";
import userDomainModel from '../models/userDomain.model';
import userModel from '../models/user.model';
import emailSentReceiveModel from '../models/emailSentReceive.model';

const saltRounds = 10;

// Helper to extract user ID from request
const getUserId = (req: Request): string => {
  if (!req.id) {
    throw new Error('User ID not found in request');
  }
  return req.id;
};

// Create new domain
export const addDomain = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    console.log("UserId is :");
    console.log(userId);

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ message: 'Domain is required', success: false });
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ 
        message: 'Invalid domain format. Please enter a valid domain name', 
        success: false 
      });
    }

    // Check if domain already exists for this user
    const existingDomain = await userDomainModel.findOne({ userId, domain });
    if (existingDomain) {
      return res.status(400).json({ 
        message: 'Domain already exists for this user', 
        success: false 
      });
    }

    const newDomain = await userDomainModel.create({ userId, domain });
    
    // Return domain with MX records for user to configure
    res.status(201).json({ 
      message: 'Domain added successfully. Please configure the following MX records in your DNS:',
      success: true, 
      domain: newDomain,
      mxRecords: {
        mx1: 'mx1.orbitmail.fun',
        mx2: 'mx2.orbitmail.fun',
        mx3: 'mx3.orbitmail.fun',
        priority1: 10,
        priority2: 20,
        priority3: 30,
        instructions: [
          'Add MX record with priority 10 pointing to mx1.orbitmail.fun',
          'Add MX record with priority 20 pointing to mx2.orbitmail.fun',
          'Add MX record with priority 30 pointing to mx3.orbitmail.fun'
        ]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


const resolveMxAsync = promisify(dns.resolveMx);

// Verify MX Record (dummy implementation)
export const VerifyMXRec = async (req: Request, res: Response) => {
  try {
    const { domainId } = req.body;

    console.log("From verifyMXRec", domainId);

    if (!domainId) {
      return res.status(400).json({ message: 'Domain ID is required', success: false });
    }

    // Find domain by ID
    const domainDoc = await userDomainModel.findById(domainId);

    console.log(domainDoc);

    if (!domainDoc) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    const domainName = domainDoc.domain; // Get actual domain name

    try {
      // Lookup MX records using the domain name
      const mxRecords = await dns.promises.resolveMx(domainName);
      const mxHosts = mxRecords.map(r => r.exchange.toLowerCase());

      console.log("Found MX hosts:", mxHosts);
      console.log("Looking for: mx1.orbitmail.fun, mx2.orbitmail.fun, mx3.orbitmail.fun");
      
      const hasMX1 = mxHosts.includes('mx1.orbitmail.fun');
      const hasMX2 = mxHosts.includes('mx2.orbitmail.fun');
      const hasMX3 = mxHosts.includes('mx3.orbitmail.fun');
      const isVerified = hasMX1 && hasMX2 && hasMX3;

      console.log("MX verification results:", { hasMX1, hasMX2, hasMX3, isVerified });

      // Update DB if verified
      if (isVerified) {
        const updatedDomain = await userDomainModel.findByIdAndUpdate(
          domainId,
          { 
            isVerified: true,
            mxVerifiedAt: new Date()
          },
          { new: true }
        );
        console.log("Updated domain in DB:", updatedDomain);
      }

      const response = {
        domain: domainName,
        mxRecords,
        verified: isVerified,
        missing: [
          !hasMX1 ? 'mx1.orbitmail.fun' : null,
          !hasMX2 ? 'mx2.orbitmail.fun' : null,
          !hasMX3 ? 'mx3.orbitmail.fun' : null,
        ].filter(Boolean),
        success: true,
      };
      
      console.log("Sending response to frontend:", response);
      return res.json(response);
    } catch (dnsError) {
      console.error("DNS lookup failed:", dnsError);
      return res.status(400).json({
        message: 'Invalid domain or DNS lookup failed',
        success: false,
        error: 'DNS_ERROR'
      });
    }
  } catch (error) {
    console.error("MX check failed:", error);
    return res.status(500).json({ 
      message: 'Server error during MX verification',
      success: false
    });
  }
};

// Get all domains for user
export const getallDomains = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    console.log("User id from the getAllDomains");
    console.log(userId);

    if (!userId) {
      return res.status(401).json({ 
        message: 'User not authenticated', 
        success: false 
      });
    }

    const domains = await userDomainModel.find({ userId }).sort({ createdAt: -1 });

    console.log("Domains from the backend");
    console.log(domains);

    return res.json({
      message: "All domains retrieved successfully",
      success: true,
      domains,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error while fetching domains',
      success: false 
    });
  }
};

// Get single domain
export const getDomain = async (req: Request, res: Response) => {
  try {
    const domain = await userDomainModel.findOne({
      _id: req.params.id,
      userId: getUserId(req),
    });

    if (!domain) return res.status(404).json({ message: 'Domain not found' });
    res.json(domain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get MX records for a domain
export const getMxRecords = async (req: Request, res: Response) => {
  try {
    const { domainId } = req.params;
    
    if (!domainId) {
      return res.status(400).json({ message: 'Domain ID is required', success: false });
    }

    const domain = await userDomainModel.findById(domainId);
    
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    const mxRecords = {
      mx1: 'mx1.orbitmail.fun',
      mx2: 'mx2.orbitmail.fun',
      mx3: 'mx3.orbitmail.fun',
      priority1: 10,
      priority2: 20,
      priority3: 30,
      instructions: [
        'Add MX record with priority 10 pointing to mx1.orbitmail.fun',
        'Add MX record with priority 20 pointing to mx2.orbitmail.fun',
        'Add MX record with priority 30 pointing to mx3.orbitmail.fun'
      ]
    };

    res.json({
      message: 'MX records retrieved successfully',
      success: true,
      domain: domain.domain,
      mxRecords
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Add email prefix to domain
export const addEmailPrefix = async (req: Request, res: Response) => {
  try {
    const { prefix, password } = req.body;
    const domainId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!prefix || !password) {
      return res.status(400).json({ message: 'Prefix and password are required', success: false });
    }

    // Validate prefix format
    const prefixRegex = /^[a-zA-Z0-9._-]+$/;
    if (!prefixRegex.test(prefix)) {
      return res.status(400).json({ 
        message: 'Invalid prefix format. Use only letters, numbers, dots, underscores, and hyphens', 
        success: false 
      });
    }

    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    // Check if domain is verified
    if (!domain.isVerified) {
      return res.status(400).json({ 
        message: 'Domain must be verified before adding email prefixes', 
        success: false 
      });
    }

    // Check if prefix already exists
    const existingEmail = domain.emails.find(email => email.prefix === prefix);
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'Email prefix already exists for this domain', 
        success: false 
      });
    }

    // Check email limit based on subscription (free tier: 2, paid: 5)
    const user = await userModel.findById(userId);
    const maxEmails = user?.subscription?.plan === 'free' ? 2 : 5;
    
    if (domain.emails.length >= maxEmails) {
      return res.status(400).json({ 
        message: `Email limit (${maxEmails}) reached. Upgrade your plan to add more emails.`, 
        success: false 
      });
    }

    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    domain.emails.push({
      prefix,
      fullEmail: `${prefix}@${domain.domain}`,
      passwordHash: hashedPassword,
    });

    const updatedDomain = await domain.save();
    
    res.json({
      message: 'Email prefix added successfully',
      success: true,
      email: {
        prefix,
        fullEmail: `${prefix}@${domain.domain}`,
        domain: domain.domain
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Remove email prefix from domain
export const removeEmailPrefix = async (req: Request, res: Response) => {
  try {
    const { prefix } = req.params;
    const domainId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    const emailIndex = domain.emails.findIndex(email => email.prefix === prefix);
    if (emailIndex === -1) {
      return res.status(404).json({ message: 'Email prefix not found', success: false });
    }

    domain.emails.splice(emailIndex, 1);
    await domain.save();

    res.json({
      message: 'Email prefix removed successfully',
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get email prefixes for a domain
export const getEmailPrefixes = async (req: Request, res: Response) => {
  try {
    const domainId = req.params.id;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    res.json({
      message: 'Email prefixes retrieved successfully',
      success: true,
      domain: domain.domain,
      emails: domain.emails.map(email => ({
        prefix: email.prefix,
        fullEmail: email.fullEmail
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Delete domain
export const deleteDomain = async (req: Request, res: Response) => {
  try {
    const deleted = await userDomainModel.findOneAndDelete({
      _id: req.params.id,
      userId: getUserId(req),
    });

    if (!deleted) return res.status(404).json({ message: 'Domain not found' });
    res.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; email: string; expiresAt: number }>();
const domainOtpStore = new Map<string, { otp: string; domainId: string; expiresAt: number }>();

// Send OTP for email deletion
export const sendOtpForEmailDeletion = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required', success: false });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(userId, { otp, email, expiresAt });

    // In a real implementation, send email here
    // For now, we'll just log it
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`Email content: This is your OTP for deleting ${email} from OrbitMail: ${otp}`);

    res.json({
      message: 'OTP sent successfully',
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Verify OTP and delete email
export const verifyOtpAndDeleteEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required', success: false });
    }

    // Get stored OTP
    const storedData = otpStore.get(userId);
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.', success: false });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(userId);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.', success: false });
    }

    // Check if email matches
    if (storedData.email !== email) {
      return res.status(400).json({ message: 'Email mismatch', success: false });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    // Extract domain and prefix from email
    const [prefix, domainName] = email.split('@');
    
    // Find the domain and remove the email
    const domain = await userDomainModel.findOne({ 
      domain: domainName, 
      userId,
      'emails.prefix': prefix 
    });

    if (!domain) {
      return res.status(404).json({ message: 'Email not found', success: false });
    }

    // Remove the email
    const emailIndex = domain.emails.findIndex(email => email.prefix === prefix);
    if (emailIndex === -1) {
      return res.status(404).json({ message: 'Email not found', success: false });
    }

    domain.emails.splice(emailIndex, 1);
    await domain.save();

    // Clear OTP
    otpStore.delete(userId);

    res.json({
      message: 'Email deleted successfully',
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get domain analytics
export const getDomainAnalytics = async (req: Request, res: Response) => {
  try {
    const { domainId } = req.params;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!domainId) {
      return res.status(400).json({ message: 'Domain ID is required', success: false });
    }

    // Find the domain
    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    // Get email analytics from the emailSentReceive model
    const emailAnalytics = await emailSentReceiveModel.aggregate([
      {
        $match: {
          $or: [
            { from: { $regex: `@${domain.domain}$` } },
            { to: { $regex: `@${domain.domain}$` } }
          ]
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          sent: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$from", regex: `@${domain.domain}$` } },
                1,
                0
              ]
            }
          },
          received: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$to", regex: `@${domain.domain}$` } },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 7 // Last 7 days
      }
    ]);

    // Calculate totals
    const totalSent = emailAnalytics.reduce((sum: number, day: any) => sum + day.sent, 0);
    const totalReceived = emailAnalytics.reduce((sum: number, day: any) => sum + day.received, 0);
    const totalEmails = totalSent + totalReceived;

    // Format chart data
    const chartData = emailAnalytics.map((day: any) => ({
      date: new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' }),
      sent: day.sent,
      received: day.received
    }));

    // If no data, provide empty chart data for the last 7 days
    if (chartData.length === 0) {
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          sent: 0,
          received: 0
        });
      }
      chartData.push(...last7Days);
    }

    res.json({
      message: 'Domain analytics retrieved successfully',
      success: true,
      analytics: {
        totalEmails,
        sentEmails: totalSent,
        receivedEmails: totalReceived,
        chartData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Send OTP for domain deletion
export const sendOtpForDomainDeletion = async (req: Request, res: Response) => {
  try {
    const { domainId } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!domainId) {
      return res.status(400).json({ message: 'Domain ID is required', success: false });
    }

    // Find the domain
    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    // Get user's email
    const user = await userModel.findById(userId);
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found', success: false });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    domainOtpStore.set(userId, { otp, domainId, expiresAt });

    // In a real implementation, send email here
    // For now, we'll just log it
    console.log(`Domain deletion OTP for ${user.email}: ${otp}`);
    console.log(`Email content: This is your OTP for deleting domain ${domain.domain} from OrbitMail: ${otp}`);

    res.json({
      message: 'OTP sent successfully',
      success: true,
      userEmail: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Verify OTP and delete domain
export const verifyOtpAndDeleteDomain = async (req: Request, res: Response) => {
  try {
    const { domainId, otp } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!domainId || !otp) {
      return res.status(400).json({ message: 'Domain ID and OTP are required', success: false });
    }

    // Get stored OTP
    const storedData = domainOtpStore.get(userId);
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.', success: false });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      domainOtpStore.delete(userId);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.', success: false });
    }

    // Check if domain ID matches
    if (storedData.domainId !== domainId) {
      return res.status(400).json({ message: 'Domain mismatch', success: false });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP', success: false });
    }

    // Delete the domain
    const deletedDomain = await userDomainModel.findOneAndDelete({ _id: domainId, userId });
    if (!deletedDomain) {
      return res.status(404).json({ message: 'Domain not found', success: false });
    }

    // Clear OTP
    domainOtpStore.delete(userId);

    res.json({
      message: 'Domain deleted successfully',
      success: true,
      deletedDomain: deletedDomain.domain
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};