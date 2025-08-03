import React, { useState, useEffect } from 'react';
import { userAuthStore } from '../../store/userAuthStore';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Plan {
  name: string;
  price: number;
  emails: number;
  features: string[];
}

interface Plans {
  basic: Plan;
  premium: Plan;
}

const Pricing: React.FC = () => {
  const { getSubscriptionPlans, getUserSubscription, createPaymentOrder, verifyPayment, isLogined } = userAuthStore();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Default plans in case API fails
  const defaultPlans: Plans = {
    basic: {
      name: 'Basic',
      price: 999,
      emails: 5,
      features: [
        '5 email addresses per domain',
        'Advanced email forwarding',
        'Email analytics (1 day, 7 days, 30 days)',
        'Priority support',
        'Custom domain support'
      ]
    },
    premium: {
      name: 'Premium',
      price: 1999,
      emails: 10,
      features: [
        '10 email addresses per domain',
        'Advanced email forwarding',
        'Custom date range analytics',
        'Priority support',
        'Custom domain support',
        'Advanced security features',
        'API access'
      ]
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Always try to get plans (public endpoint)
      let plansData;
      try {
        plansData = await getSubscriptionPlans();
        setPlans(plansData.plans);
      } catch (error) {
        console.log('Using default plans');
        setPlans(defaultPlans);
      }
      
      // Only get user subscription if logged in
      if (isLogined) {
        try {
          const subscriptionData = await getUserSubscription();
          setUserSubscription(subscriptionData.subscription);
        } catch (error) {
          console.log('User not logged in or subscription fetch failed');
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      // Don't show error toast, just use default plans
      setPlans(defaultPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    // Check if user is logged in
    if (!isLogined) {
      toast.error('Please sign in to subscribe');
      navigate('/signin');
      return;
    }

    try {
      setSelectedPlan(plan);
      toast.loading('Creating payment order...');
      
      const orderData = await createPaymentOrder(plan);
      
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'OrbitMail',
        description: `${orderData.order.planDetails.name} Subscription`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan
            });
            
            toast.success('Payment successful! Subscription activated.');
            fetchData(); // Refresh subscription data
          } catch (error: any) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          email: userSubscription?.email || '',
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment order');
    } finally {
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start with our free plan and upgrade as you grow
          </p>
        </div>

        {/* Current Subscription Status - Only show if logged in */}
        {isLogined && userSubscription && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">
                  {userSubscription.plan === 'free' ? 'Free Plan' : userSubscription.planDetails?.name}
                </p>
                <p className="text-gray-600">
                  Status: {userSubscription.status}
                </p>
                {userSubscription.endDate && (
                  <p className="text-gray-600">
                    Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {userSubscription.plan !== 'free' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                ₹0
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                2 email addresses per domain
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic email forwarding
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community support
              </li>
            </ul>
            
            <button
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
              disabled
            >
              Current Plan
            </button>
          </div>

          {/* Basic Plan */}
          {plans?.basic && (
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans.basic.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  ₹{plans.basic.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Great for small teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plans.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe('basic')}
                disabled={selectedPlan === 'basic'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {selectedPlan === 'basic' ? 'Processing...' : 'Subscribe to Basic'}
              </button>
            </div>
          )}

          {/* Premium Plan */}
          {plans?.premium && (
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans.premium.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  ₹{plans.premium.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for growing businesses</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plans.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={selectedPlan === 'premium'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {selectedPlan === 'premium' ? 'Processing...' : 'Subscribe to Premium'}
              </button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and UPI payments through Razorpay.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, you can start with our free plan which includes 2 email addresses per domain.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
