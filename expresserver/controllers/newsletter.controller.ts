import { Request, Response } from 'express';
import { NewsletterModel } from '../models/newsletter.model.js';

export const subscribeToNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingSubscription = await NewsletterModel.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscription
    const newSubscription = new NewsletterModel({
      email,
      subscribedAt: new Date(),
      isActive: true
    });

    await newSubscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter! We\'ll keep you updated with the latest news.',
      data: {
        email: newSubscription.email,
        subscribedAt: newSubscription.subscribedAt
      }
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again.',
      error: error.message
    });
  }
}; 