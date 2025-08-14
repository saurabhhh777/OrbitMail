import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userAuthStore } from "../../store/userAuthStore";
import { Toaster, toast } from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from "../components/Navbar";

// Define the domain object type
interface Domain {
  _id: string;
  userId: string;
  domain: string;
  isVerified: boolean;
  emails: any[];
  createdAt: string;
  __v: number;
}

interface EmailPrefix {
  prefix: string;
  fullEmail: string;
}

interface Analytics {
  period: string;
  startDate: string;
  endDate: string;
  totalEmails: number;
  sentEmails: number;
  receivedEmails: number;
  chartData: Array<{
    date: string;
    sent: number;
    received: number;
  }>;
}

interface Subscription {
  plan: string;
  status: string;
  startDate?: string;
  endDate?: string;
  planDetails?: {
    name: string;
    price: number;
    emails: number;
    features: string[];
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    getAllDomain, 
    addDomain, 
    verifyDomain, 
    removeDomain,
    getEmailPrefixes,
    addEmailPrefix,
    removeEmailPrefix,
    sendOtpForEmailDeletion,
    verifyOtpAndDeleteEmail,
    sendOtpForDomainDeletion,
    verifyOtpAndDeleteDomain,
    getDomainAnalytics,
    getEmailAnalytics,
    getUserSubscription
  } = userAuthStore();
  
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [emailPrefixes, setEmailPrefixes] = useState<EmailPrefix[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [domainAnalytics, setDomainAnalytics] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
  const [addingDomain, setAddingDomain] = useState<boolean>(false);
  const [newDomain, setNewDomain] = useState<string>("");
  const [newPrefix, setNewPrefix] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<string>("7days");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  
  // Domain deletion OTP state
  const [showDomainOtpModal, setShowDomainOtpModal] = useState<boolean>(false);
  const [domainToDelete, setDomainToDelete] = useState<any>(null);
  const [domainOtpCode, setDomainOtpCode] = useState<string>("");
  const [domainOtpLoading, setDomainOtpLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data...");
      
      const [domainsResponse, subscriptionResponse] = await Promise.all([
        getAllDomain(),
        getUserSubscription()
      ]);
      
      console.log("Domains response:", domainsResponse);
      console.log("Subscription response:", subscriptionResponse);
      
      // Handle different response structures
      if (domainsResponse?.domains) {
        setDomains(domainsResponse.domains);
      } else if (domainsResponse?.data) {
        setDomains(domainsResponse.data);
      } else if (Array.isArray(domainsResponse)) {
        setDomains(domainsResponse);
      } else {
        console.log("No domains found in response");
        setDomains([]);
      }
      
      if (subscriptionResponse?.subscription) {
        setSubscription(subscriptionResponse.subscription);
      } else if (subscriptionResponse?.data) {
        setSubscription(subscriptionResponse.data);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [getAllDomain, getUserSubscription]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerifyDomain = async (domainId: string, domainName: string) => {
    try {
      setVerifying(prev => ({ ...prev, [domainId]: true }));
      const response = await verifyDomain(domainId);
      
      console.log("Verification response:", response);
      console.log("Response data:", response?.data);
      console.log("Success:", response?.data?.success);
      console.log("Verified:", response?.data?.verified);
      
      // Check if verification was successful
      if (response?.data?.success && response?.data?.verified) {
        toast.success(`${domainName} is verified successfully!`);
        // Refresh the domains list to get the updated status from server
        await fetchData();
      } else if (response?.data?.success && !response?.data?.verified) {
        // Domain was checked but not verified
        const missing = response?.data?.missing || [];
        if (missing.length > 0) {
          toast.error(`Domain verification failed. Missing MX records: ${missing.join(', ')}`);
        } else {
          toast.error(`Domain verification failed. Please check your MX record configuration.`);
        }
      } else {
        toast.error(response?.data?.message || `Failed to verify ${domainName}`);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || `Failed to verify ${domainName}`);
    } finally {
      setVerifying(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const handleAddDomain = async () => {
    const domain = newDomain.trim();
    if (!domain) {
      toast.error("Please enter a domain name.");
      return;
    }

    try {
      setAddingDomain(true);
      console.log("Adding domain:", domain);
      const res = await addDomain(domain);
      console.log("Add domain response:", res);
      
      if (res?.data?.success || res?.success) {
        toast.success("Domain added successfully");
        setNewDomain("");
        await fetchData(); // Refresh the domains list
      } else {
        toast.error("Failed to add domain");
      }
    } catch (error: any) {
      console.error("Add domain error:", error);
      toast.error(error.message || "Failed to add domain");
    } finally {
      setAddingDomain(false);
    }
  };

  const handleAddEmailPrefix = async () => {
    if (!selectedDomain) {
      toast.error("Please select a domain first");
      return;
    }

    if (!newPrefix || !newPassword) {
      toast.error("Please enter both prefix and password");
      return;
    }

    try {
      const res = await addEmailPrefix(selectedDomain._id, newPrefix, newPassword);
      if (res?.success) {
        toast.success("Email prefix added successfully");
        setNewPrefix("");
        setNewPassword("");
        await loadEmailPrefixes(selectedDomain._id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add email prefix");
    }
  };

  const handleRemoveEmailPrefix = async (prefix: string) => {
    if (!selectedDomain) return;
    
    const emailToDelete = `${prefix}@${selectedDomain.domain}`;
    setOtpEmail(emailToDelete);
    setShowOtpModal(true);
  };

  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      await sendOtpForEmailDeletion(otpEmail);
      toast.success("OTP sent to your email. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtpAndDelete = async () => {
    if (!otpCode.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setOtpLoading(true);
      await verifyOtpAndDeleteEmail(otpEmail, otpCode);
      toast.success("Email deleted successfully");
      setShowOtpModal(false);
      setOtpCode("");
      setOtpEmail("");
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRemoveDomain = async (domain: any) => {
    if (domain.isVerified) {
      // For verified domains, show OTP modal
      setDomainToDelete(domain);
      setShowDomainOtpModal(true);
    } else {
      // For unverified domains, show confirmation alert
      if (window.confirm(`Are you sure you want to delete the domain "${domain.domain}"? This action cannot be undone.`)) {
        try {
          await removeDomain(domain._id);
          toast.success("Domain deleted successfully");
          await fetchData();
        } catch (error: any) {
          toast.error(error.message || "Failed to delete domain");
        }
      }
    }
  };

  const handleSendDomainOtp = async () => {
    try {
      setDomainOtpLoading(true);
      await sendOtpForDomainDeletion(domainToDelete._id);
      toast.success("OTP sent to your email. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setDomainOtpLoading(false);
    }
  };

  const handleVerifyDomainOtpAndDelete = async () => {
    if (!domainOtpCode.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setDomainOtpLoading(true);
      await verifyOtpAndDeleteDomain(domainToDelete._id, domainOtpCode);
      toast.success("Domain deleted successfully");
      setShowDomainOtpModal(false);
      setDomainOtpCode("");
      setDomainToDelete(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setDomainOtpLoading(false);
    }
  };

  const loadEmailPrefixes = async (domainId: string) => {
    try {
      const res = await getEmailPrefixes(domainId);
      if (res?.emails) {
        setEmailPrefixes(res.emails);
      }
    } catch (error: any) {
      console.error("Error loading email prefixes:", error);
    }
  };

  const handleDomainSelect = async (domain: Domain) => {
    setSelectedDomain(domain);
    await loadEmailPrefixes(domain._id);
    await loadDomainAnalytics(domain._id);
  };

  const loadAnalytics = async (email: string, period: string) => {
    try {
      const res = await getEmailAnalytics(email, period);
      if (res?.analytics) {
        setAnalytics(res.analytics);
      }
    } catch (error: any) {
      console.error("Error loading analytics:", error);
    }
  };

  const loadDomainAnalytics = async (domainId: string) => {
    try {
      const res = await getDomainAnalytics(domainId);
      if (res?.success && res?.analytics) {
        setDomainAnalytics(res.analytics);
      } else {
        // If no data, set empty analytics
        setDomainAnalytics({
          totalEmails: 0,
          sentEmails: 0,
          receivedEmails: 0,
          chartData: []
        });
      }
    } catch (error: any) {
      console.error("Error loading domain analytics:", error);
      // Set empty analytics on error
      setDomainAnalytics({
        totalEmails: 0,
        sentEmails: 0,
        receivedEmails: 0,
        chartData: []
      });
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const { isDarkMode } = userAuthStore();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      }`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          isDarkMode ? "border-[#3B82F6]" : "border-[#3B82F6]"
        }`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
    }`}>
      <Navbar />
      <div className="p-6">
        <Toaster />
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className={`text-3xl font-bold font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>
              OrbitMail Dashboard
            </h1>
            <p className={`font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Manage your domains, emails, and analytics
            </p>
          </header>

          {/* Subscription Status */}
          {subscription && (
            <div className={`rounded-lg shadow p-6 mb-8 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h2 className={`text-xl font-semibold mb-4 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Subscription Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-medium font-poppins ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                  }`}>
                    {subscription.plan === 'free' ? 'Free Plan' : subscription.planDetails?.name}
                  </p>
                  <p className={`font-jost ${
                    isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                  }`}>
                    Status: {subscription.status}
                  </p>
                  {subscription.endDate && (
                    <p className={`font-jost ${
                      isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                    }`}>
                      Expires: {formatDate(subscription.endDate)}
                    </p>
                  )}
                </div>
                {subscription.plan !== 'free' && (
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

          {/* Add Domain */}
          <div className={`rounded-lg shadow p-6 mb-8 border transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <h2 className={`text-xl font-semibold mb-4 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Add New Domain</h2>
            <div className="flex">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Enter domain name (e.g., yourdomain.com)"
                className={`flex-1 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                  isDarkMode 
                    ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                    : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
              />
              <button
                onClick={handleAddDomain}
                disabled={addingDomain}
                className={`px-6 py-2 rounded-r-lg transition-colors font-medium ${
                  addingDomain 
                    ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed" 
                    : "bg-[#3B82F6] text-[#FAFAFA] hover:bg-[#2563EB]"
                }`}
              >
                {addingDomain ? "Adding..." : "Add Domain"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domains List */}
            <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h2 className={`text-xl font-semibold mb-4 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Your Domains</h2>
              
              {domains.length === 0 ? (
                <p className={`font-jost ${
                  isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
                }`}>No domains found. Add your first domain!</p>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div 
                      key={domain._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedDomain?._id === domain._id 
                          ? isDarkMode
                            ? 'border-[#3B82F6] bg-[#1E3A8A]' 
                            : 'border-[#3B82F6] bg-[#EFF6FF]'
                          : isDarkMode
                            ? 'border-[#404040] hover:border-[#525252] bg-[#262626]' 
                            : 'border-[#E5E5E5] hover:border-[#D4D4D4] bg-[#FFFFFF]'
                      }`}
                      onClick={() => handleDomainSelect(domain)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-lg font-mono font-bold font-poppins ${
                          isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                        }`}>
                          {domain.domain}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          domain.isVerified 
                            ? isDarkMode
                              ? "bg-[#10B981] text-[#0A0A0A]" 
                              : "bg-[#DCFCE7] text-[#16A34A]"
                            : isDarkMode
                              ? "bg-[#F59E0B] text-[#0A0A0A]" 
                              : "bg-[#FEF3C7] text-[#D97706]"
                        }`}>
                          {domain.isVerified ? "Verified" : "Pending Verification"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className={`text-sm font-jost ${
                          isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
                        }`}>
                          <span>Created: {formatDate(domain.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>Emails: {domain.emails.length}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              domain.isVerified
                                ? isDarkMode
                                  ? "bg-[#404040] text-[#D4D4D4] cursor-not-allowed"
                                  : "bg-[#F5F5F5] text-[#737373] cursor-not-allowed"
                                : isDarkMode
                                  ? "bg-[#10B981] hover:bg-[#059669] text-[#0A0A0A]"
                                  : "bg-[#10B981] hover:bg-[#059669] text-[#FAFAFA]"
                            }`}
                            disabled={domain.isVerified || verifying[domain._id]}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyDomain(domain._id, domain.domain);
                            }}
                          >
                            {verifying[domain._id] ? "Verifying..." : domain.isVerified ? "Verified" : "Verify"}
                          </button>
                          
                          <button 
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              isDarkMode
                                ? "bg-[#EF4444] hover:bg-[#DC2626] text-[#FAFAFA]"
                                : "bg-[#EF4444] hover:bg-[#DC2626] text-[#FAFAFA]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveDomain(domain);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Prefixes */}
            <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h2 className={`text-xl font-semibold mb-4 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>
                Email Prefixes {selectedDomain && `- ${selectedDomain.domain}`}
              </h2>
              
              {selectedDomain ? (
                <>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newPrefix}
                        onChange={(e) => setNewPrefix(e.target.value)}
                        placeholder="Prefix (e.g., founder)"
                        className={`flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                          isDarkMode 
                            ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                            : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                        }`}
                      />
                      <div className="flex-1 relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Password"
                          className={`w-full rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                            isDarkMode 
                              ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                              : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                          }`}
                        />
                        <button
                          type="button"
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${
                            isDarkMode 
                              ? "text-[#8A8A8A] hover:text-[#D4D4D4]" 
                              : "text-[#737373] hover:text-[#404040]"
                          }`}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button
                        onClick={handleAddEmailPrefix}
                        className={`px-4 py-2 rounded transition-colors font-medium ${
                          isDarkMode
                            ? "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                            : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {emailPrefixes.map((email, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 rounded transition-colors ${
                        isDarkMode 
                          ? "bg-[#262626] border-[#404040]" 
                          : "bg-[#F5F5F5] border-[#E5E5E5]"
                      } border`}>
                        <span className={`font-mono font-poppins ${
                          isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                        }`}>{email.fullEmail}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/compose?from=${encodeURIComponent(email.fullEmail)}`)}
                            className={`text-sm transition-colors font-medium ${
                              isDarkMode
                                ? "text-[#3B82F6] hover:text-[#60A5FA]"
                                : "text-[#3B82F6] hover:text-[#2563EB]"
                            }`}
                          >
                            Compose
                          </button>
                          <button
                            onClick={() => handleRemoveEmailPrefix(email.prefix)}
                            className={`text-sm transition-colors font-medium ${
                              isDarkMode
                                ? "text-[#EF4444] hover:text-[#F87171]"
                                : "text-[#EF4444] hover:text-[#DC2626]"
                            }`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={`font-jost ${
                  isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
                }`}>Select a domain to manage email prefixes</p>
              )}
            </div>
          </div>

          {/* Domain Analytics */}
          {selectedDomain && domainAnalytics && (
            <div className={`rounded-lg shadow p-6 mt-8 border transition-colors duration-200 ${
              isDarkMode 
                ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
                : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <h2 className={`text-xl font-semibold mb-4 font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Domain Analytics - {selectedDomain.domain}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? "bg-[#1E3A8A] border-[#3B82F6] text-[#FAFAFA]" 
                    : "bg-[#EFF6FF] border-[#3B82F6] text-[#1E40AF]"
                }`}>
                  <h3 className={`text-lg font-semibold font-poppins ${
                    isDarkMode ? "text-[#93C5FD]" : "text-[#1E40AF]"
                  }`}>Total Emails</h3>
                  <p className={`text-2xl font-bold font-poppins ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#1E40AF]"
                  }`}>{domainAnalytics.totalEmails}</p>
                </div>
                <div className={`p-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? "bg-[#064E3B] border-[#10B981] text-[#FAFAFA]" 
                    : "bg-[#ECFDF5] border-[#10B981] text-[#065F46]"
                }`}>
                  <h3 className={`text-lg font-semibold font-poppins ${
                    isDarkMode ? "text-[#6EE7B7]" : "text-[#065F46]"
                  }`}>Sent</h3>
                  <p className={`text-2xl font-bold font-poppins ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#065F46]"
                  }`}>{domainAnalytics.sentEmails}</p>
                </div>
                <div className={`p-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? "bg-[#581C87] border-[#8B5CF6] text-[#FAFAFA]" 
                    : "bg-[#F3E8FF] border-[#8B5CF6] text-[#6B21A8]"
                }`}>
                  <h3 className={`text-lg font-semibold font-poppins ${
                    isDarkMode ? "text-[#C4B5FD]" : "text-[#6B21A8]"
                  }`}>Received</h3>
                  <p className={`text-2xl font-bold font-poppins ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#6B21A8]"
                  }`}>{domainAnalytics.receivedEmails}</p>
                </div>
              </div>

              {domainAnalytics.chartData && domainAnalytics.chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={domainAnalytics.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sent" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={`text-center py-8 ${
                  isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
                }`}>
                  <p className="font-jost">No email activity data available for this domain yet.</p>
                  <p className="text-sm mt-2 font-jost">Send or receive emails to see analytics here.</p>
                </div>
              )}
            </div>
          )}

          {/* Email Analytics */}
          <div className={`rounded-lg shadow p-6 mt-8 border transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <h2 className={`text-xl font-semibold mb-4 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Email Analytics</h2>
            
            <div className="mb-4 flex gap-4 items-center">
              <select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className={`rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                  isDarkMode 
                    ? "border-[#404040] bg-[#262626] text-[#FAFAFA]" 
                    : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A]"
                }`}
              >
                <option value="">Select Email Address</option>
                {emailPrefixes.map((email, index) => (
                  <option key={index} value={email.fullEmail}>
                    {email.fullEmail}
                  </option>
                ))}
              </select>

              <select
                value={analyticsPeriod}
                onChange={(e) => setAnalyticsPeriod(e.target.value)}
                className={`rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                  isDarkMode 
                    ? "border-[#404040] bg-[#262626] text-[#FAFAFA]" 
                    : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A]"
                }`}
              >
                <option value="1day">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                {subscription?.plan !== 'free' && (
                  <option value="custom">Custom Range</option>
                )}
              </select>

              {selectedEmail && (
                <button
                  onClick={() => loadAnalytics(selectedEmail, analyticsPeriod)}
                  className={`px-4 py-2 rounded transition-colors font-medium ${
                    isDarkMode
                      ? "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                      : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                  }`}
                >
                  Load Analytics
                </button>
              )}
            </div>

            {analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? "bg-[#1E3A8A] border-[#3B82F6] text-[#FAFAFA]" 
                      : "bg-[#EFF6FF] border-[#3B82F6] text-[#1E40AF]"
                  }`}>
                    <h3 className={`text-lg font-semibold font-poppins ${
                      isDarkMode ? "text-[#93C5FD]" : "text-[#1E40AF]"
                    }`}>Total Emails</h3>
                    <p className={`text-2xl font-bold font-poppins ${
                      isDarkMode ? "text-[#FAFAFA]" : "text-[#1E40AF]"
                    }`}>{analytics.totalEmails}</p>
                  </div>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? "bg-[#064E3B] border-[#10B981] text-[#FAFAFA]" 
                      : "bg-[#ECFDF5] border-[#10B981] text-[#065F46]"
                  }`}>
                    <h3 className={`text-lg font-semibold font-poppins ${
                      isDarkMode ? "text-[#6EE7B7]" : "text-[#065F46]"
                    }`}>Sent</h3>
                    <p className={`text-2xl font-bold font-poppins ${
                      isDarkMode ? "text-[#FAFAFA]" : "text-[#065F46]"
                    }`}>{analytics.sentEmails}</p>
                  </div>
                  <div className={`p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? "bg-[#581C87] border-[#8B5CF6] text-[#FAFAFA]" 
                      : "bg-[#F3E8FF] border-[#8B5CF6] text-[#6B21A8]"
                  }`}>
                    <h3 className={`text-lg font-semibold font-poppins ${
                      isDarkMode ? "text-[#C4B5FD]" : "text-[#6B21A8]"
                    }`}>Received</h3>
                    <p className={`text-2xl font-bold font-poppins ${
                      isDarkMode ? "text-[#FAFAFA]" : "text-[#6B21A8]"
                    }`}>{analytics.receivedEmails}</p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sent" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Send Email */}
          <div className={`rounded-lg shadow p-6 mt-8 border transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>Send Email</h2>
              <button
                onClick={() => navigate('/compose')}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  isDarkMode
                    ? "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                }`}
              >
                Compose Email
              </button>
            </div>
            <p className={`font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Click "Compose Email" to create and send a new email from your verified domains.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-full max-w-md mx-4 border transition-colors ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Verify Email Deletion</h3>
            <p className={`mb-4 font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              We'll send an OTP to your email to confirm the deletion of <strong>{otpEmail}</strong>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleSendOtp}
                disabled={otpLoading}
                className={`w-full py-2 rounded transition-colors font-medium ${
                  otpLoading 
                    ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed" 
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                }`}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium font-poppins ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>Enter OTP</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyOtpAndDelete}
                  disabled={otpLoading || !otpCode.trim()}
                  className={`flex-1 py-2 rounded transition-colors font-medium ${
                    otpLoading || !otpCode.trim()
                      ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed" 
                      : "bg-[#EF4444] hover:bg-[#DC2626] text-[#FAFAFA]"
                  }`}
                >
                  {otpLoading ? "Verifying..." : "Delete Email"}
                </button>
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                    setOtpEmail("");
                  }}
                  className={`flex-1 py-2 rounded transition-colors font-medium ${
                    isDarkMode
                      ? "bg-[#404040] hover:bg-[#525252] text-[#FAFAFA]"
                      : "bg-[#D4D4D4] hover:bg-[#A3A3A3] text-[#0A0A0A]"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Domain Deletion OTP Modal */}
      {showDomainOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-full max-w-md mx-4 border transition-colors ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Verify Domain Deletion</h3>
            <p className={`mb-4 font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              We'll send an OTP to your email to confirm the deletion of domain <strong>{domainToDelete?.domain}</strong>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleSendDomainOtp}
                disabled={domainOtpLoading}
                className={`w-full py-2 rounded transition-colors font-medium ${
                  domainOtpLoading 
                    ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed" 
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                }`}
              >
                {domainOtpLoading ? "Sending..." : "Send OTP"}
              </button>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium font-poppins ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>Enter OTP</label>
                <input
                  type="text"
                  value={domainOtpCode}
                  onChange={(e) => setDomainOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyDomainOtpAndDelete}
                  disabled={domainOtpLoading || !domainOtpCode.trim()}
                  className={`flex-1 py-2 rounded transition-colors font-medium ${
                    domainOtpLoading || !domainOtpCode.trim()
                      ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed" 
                      : "bg-[#EF4444] hover:bg-[#DC2626] text-[#FAFAFA]"
                  }`}
                >
                  {domainOtpLoading ? "Verifying..." : "Delete Domain"}
                </button>
                <button
                  onClick={() => {
                    setShowDomainOtpModal(false);
                    setDomainOtpCode("");
                    setDomainToDelete(null);
                  }}
                  className={`flex-1 py-2 rounded transition-colors font-medium ${
                    isDarkMode
                      ? "bg-[#404040] hover:bg-[#525252] text-[#FAFAFA]"
                      : "bg-[#D4D4D4] hover:bg-[#A3A3A3] text-[#0A0A0A]"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;