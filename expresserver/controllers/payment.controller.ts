import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import userModel from '../models/user.model';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Subscription plans
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999, // ₹999/month
    emails: 5,
    features: ['5 email addresses per domain', 'Basic support', 'Email forwarding']
  },
  premium: {
    name: 'Premium Plan',
    price: 1999, // ₹1999/month
    emails: 10,
    features: ['10 email addresses per domain', 'Priority support', 'Advanced features', 'Custom branding']
  }
};

// Create payment order
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { plan } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      return res.status(400).json({ message: 'Invalid plan selected', success: false });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    
    const options = {
      amount: planDetails.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId,
        plan: plan,
        userEmail: user.email
      }
    };

    if (!razorpay) {
      return res.status(500).json({ message: 'Payment service not configured', success: false });
    }
    
    const order = await razorpay.orders.create(options);

    res.json({
      message: 'Payment order created successfully',
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        plan: plan,
        planDetails: planDetails
      }
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Failed to create payment order', success: false });
  }
};

// Verify payment and update subscription
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return res.status(400).json({ message: 'Payment verification failed', success: false });
    }

    // Verify payment signature
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Payment service not configured', success: false });
    }
    
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature', success: false });
    }

    // Update user subscription
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    user.subscription = {
      plan: plan as 'basic' | 'premium',
      status: 'active',
      startDate: new Date(),
      endDate: endDate
    };

    await user.save();

    res.json({
      message: 'Payment verified and subscription updated successfully',
      success: true,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        planDetails: planDetails
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', success: false });
  }
};

// Get subscription plans
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    res.json({
      message: 'Subscription plans retrieved successfully',
      success: true,
      plans: SUBSCRIPTION_PLANS
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Failed to get subscription plans', success: false });
  }
};

// Get user subscription status
export const getUserSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated', success: false });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const planDetails = user.subscription?.plan && user.subscription.plan !== 'free' 
      ? SUBSCRIPTION_PLANS[user.subscription.plan as 'basic' | 'premium'] 
      : null;

    res.json({
      message: 'User subscription retrieved successfully',
      success: true,
      subscription: {
        plan: user.subscription?.plan || 'free',
        status: user.subscription?.status || 'active',
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate,
        planDetails: planDetails
      }
    });

  } catch (error) {
    console.error('Get user subscription error:', error);
    res.status(500).json({ message: 'Failed to get user subscription', success: false });
  }
}; 