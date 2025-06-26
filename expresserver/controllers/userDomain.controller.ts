// userDomain.controller.ts
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import dns from 'dns/promises';
import userDomainModel from '../models/userDomain.model';

const saltRounds = 10;

// Helper to extract user ID from request
const getUserId = (req: Request) => req.id;

// Create new domain
export const addDomain = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    console.log("UserId is :");
    console.log(userId);

    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ message: 'Domain is required', success: false });
    }
    const newDomain = await userDomainModel.create({ userId, domain });
    res.status(201).json({ message: 'Domain added successfully', success: true, domain: newDomain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Verify MX Record (dummy implementation)
export const VerifyMXRec = async (req: Request, res: Response) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ message: 'Domain is required', success: false });
    }

    // Lookup MX records
    const mxRecords = await dns.resolveMx(domain);
    const mxHosts = mxRecords.map(r => r.exchange.toLowerCase());

    const hasMX1 = mxHosts.includes('mx1.orbitmail.fun');
    const hasMX2 = mxHosts.includes('mx2.orbitmail.fun');

    const isVerified = hasMX1 && hasMX2;

    // Update DB if verified
    if (isVerified) {
      await userDomainModel.findOneAndUpdate(
        { domain },
        { isVerify: true },
        { new: true }
      );
    }

    return res.json({
      domain,
      mxRecords,
      verified: isVerified,
      missing: [
        !hasMX1 ? 'mx1.orbitmail.fun' : null,
        !hasMX2 ? 'mx2.orbitmail.fun' : null,
      ].filter(Boolean),
      success: true,
    });
  } catch (error) {
    console.error("MX check failed:", error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get all domains for user
export const getallDomains = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const domains = await userDomainModel.find({ userId });
    res.json(domains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

// Update domain emails
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const { op, prefix, password, newPassword } = req.body;
    const domainId = req.params.id;
    const userId = getUserId(req);

    if (!['add', 'remove', 'update'].includes(op)) {
      return res.status(400).json({ message: 'Invalid operation' });
    }

    const domain = await userDomainModel.findOne({ _id: domainId, userId });
    if (!domain) return res.status(404).json({ message: 'Domain not found' });

    switch (op) {
      case 'add':
        if (domain.emails.length >= 5) {
          return res.status(400).json({ message: 'Email limit (5) reached' });
        }
        
        const hashedPassword = await bcryptjs.hash(password, saltRounds);
        domain.emails.push({
          prefix,
          fullEmail: `${prefix}@${domain.domain}`,
          passwordHash: hashedPassword,
        });
        break;

      case 'remove':
        const emailIndex = domain.emails.findIndex(email => email.prefix === prefix);
        if (emailIndex === -1) {
          return res.status(404).json({ message: 'Email prefix not found' });
        }
        domain.emails.splice(emailIndex, 1);
        break;

      case 'update':
        const email = domain.emails.find(e => e.prefix === prefix);
        if (!email) return res.status(404).json({ message: 'Email prefix not found' });
        email.passwordHash = await bcryptjs.hash(newPassword, saltRounds);
        break;
    }

    const updatedDomain = await domain.save();
    res.json(updatedDomain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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