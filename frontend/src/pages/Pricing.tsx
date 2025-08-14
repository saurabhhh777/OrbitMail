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
  const { getSubscriptionPlans, getUserSubscription, createPaymentOrder, verifyPayment, isLogined, isDarkMode } = userAuthStore();
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
      <div className={`min-h-screen ${
        isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      }`}>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDarkMode ? "border-[#3B82F6]" : "border-[#3B82F6]"
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
    }`}>
      <Navbar />
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Choose Your Plan
          </h1>
          <p className={`text-xl font-jost ${
            isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
          }`}>
            Start with our free plan and upgrade as you grow
          </p>
        </div>

        {/* Current Subscription Status - Only show if logged in */}
        {isLogined && userSubscription && (
          <div className={`mb-8 rounded-lg shadow p-6 border transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <h2 className={`text-2xl font-semibold mb-4 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Current Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-lg font-medium font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>
                  {userSubscription.plan === 'free' ? 'Free Plan' : userSubscription.planDetails?.name}
                </p>
                <p className={`font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>
                  Status: {userSubscription.status}
                </p>
                {userSubscription.endDate && (
                  <p className={`font-jost ${
                    isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                  }`}>
                    Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {userSubscription.plan !== 'free' && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? "bg-[#10B981] text-[#0A0A0A]" 
                    : "bg-[#DCFCE7] text-[#16A34A]"
                }`}>
                  Active
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className={`rounded-lg shadow-lg p-8 border-2 transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#404040] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Free</h3>
              <div className={`text-4xl font-bold mb-4 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>
                ₹0
                <span className={`text-lg font-normal font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>/month</span>
              </div>
              <p className={`mb-6 font-jost ${
                isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
              }`}>Perfect for getting started</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#10B981] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>2 email addresses per domain</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#10B981] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>Basic email forwarding</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#10B981] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>Community support</span>
              </li>
            </ul>
            
            <button
              className={`w-full py-3 px-6 rounded-lg font-medium cursor-not-allowed transition-colors ${
                isDarkMode
                  ? "bg-[#404040] text-[#8A8A8A]"
                  : "bg-[#F5F5F5] text-[#737373]"
              }`}
              disabled
            >
              Current Plan
            </button>
          </div>

          {/* Basic Plan */}
          {plans?.basic && (
            <div className={`rounded-lg shadow-lg p-8 border-2 relative transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#3B82F6] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#3B82F6] text-[#0A0A0A]"
            }`}>
              <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-lg text-sm font-medium ${
                isDarkMode 
                  ? "bg-[#3B82F6] text-[#FAFAFA]" 
                  : "bg-[#3B82F6] text-[#FAFAFA]"
              }`}>
                Popular
              </div>
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>{plans.basic.name}</h3>
                <div className={`text-4xl font-bold mb-4 font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>
                  ₹{plans.basic.price}
                  <span className={`text-lg font-normal font-jost ${
                    isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                  }`}>/month</span>
                </div>
                <p className={`mb-6 font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>Great for small teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plans.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-[#10B981] mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`font-jost ${
                      isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                    }`}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe('basic')}
                disabled={selectedPlan === 'basic'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors font-poppins ${
                  selectedPlan === 'basic'
                    ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                }`}
              >
                {selectedPlan === 'basic' ? 'Processing...' : 'Subscribe to Basic'}
              </button>
            </div>
          )}

          {/* Premium Plan */}
          {plans?.premium && (
            <div className={`rounded-lg shadow-lg p-8 border-2 transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#404040] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>{plans.premium.name}</h3>
                <div className={`text-4xl font-bold mb-4 font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>
                  ₹{plans.premium.price}
                  <span className={`text-lg font-normal font-jost ${
                    isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                  }`}>/month</span>
                </div>
                <p className={`mb-6 font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>Perfect for growing businesses</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plans.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-[#10B981] mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`font-jost ${
                      isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                    }`}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={selectedPlan === 'premium'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors font-poppins ${
                  selectedPlan === 'premium'
                    ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                }`}
              >
                {selectedPlan === 'premium' ? 'Processing...' : 'Subscribe to Premium'}
              </button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-8 font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h3 className={`text-lg font-semibold mb-2 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Can I upgrade or downgrade my plan?</h3>
              <p className={`font-jost ${
                isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
              }`}>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h3 className={`text-lg font-semibold mb-2 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>What payment methods do you accept?</h3>
              <p className={`font-jost ${
                isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
              }`}>We accept all major credit cards, debit cards, and UPI payments through Razorpay.</p>
            </div>
            <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h3 className={`text-lg font-semibold mb-2 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Is there a free trial?</h3>
              <p className={`font-jost ${
                isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
              }`}>Yes, you can start with our free plan which includes 2 email addresses per domain.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
