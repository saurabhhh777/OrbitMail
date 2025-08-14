import React, { useState, useEffect, useCallback } from "react";
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
  const { 
    getAllDomain, 
    addDomain, 
    verifyDomain, 
    getEmailPrefixes,
    addEmailPrefix,
    removeEmailPrefix,
    sendOtpForEmailDeletion,
    verifyOtpAndDeleteEmail,
    getEmailAnalytics,
    getUserSubscription,
    sendEmail
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
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    text: "",
    from: ""
  });

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
      // Mock domain analytics data for now
      const mockData = {
        totalEmails: Math.floor(Math.random() * 1000) + 100,
        sentEmails: Math.floor(Math.random() * 500) + 50,
        receivedEmails: Math.floor(Math.random() * 500) + 50,
        chartData: [
          { date: 'Mon', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Tue', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Wed', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Thu', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Fri', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Sat', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
          { date: 'Sun', sent: Math.floor(Math.random() * 50), received: Math.floor(Math.random() * 50) },
        ]
      };
      setDomainAnalytics(mockData);
    } catch (error: any) {
      console.error("Error loading domain analytics:", error);
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.text || !emailForm.from) {
      toast.error("Please fill all email fields");
      return;
    }

    try {
      const res = await sendEmail(emailForm);
      if (res?.success) {
        toast.success("Email sent successfully");
        setEmailForm({ to: "", subject: "", text: "", from: "" });
        setShowEmailForm(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send email");
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



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <Toaster />
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              OrbitMail Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your domains, emails, and analytics
            </p>
          </header>

          {/* Subscription Status */}
          {subscription && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">
                    {subscription.plan === 'free' ? 'Free Plan' : subscription.planDetails?.name}
                  </p>
                  <p className="text-gray-600">
                    Status: {subscription.status}
                  </p>
                  {subscription.endDate && (
                    <p className="text-gray-600">
                      Expires: {formatDate(subscription.endDate)}
                    </p>
                  )}
                </div>
                {subscription.plan !== 'free' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add Domain */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Domain</h2>
            <div className="flex">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Enter domain name (e.g., yourdomain.com)"
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
              />
              <button
                onClick={handleAddDomain}
                disabled={addingDomain}
                className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {addingDomain ? "Adding..." : "Add Domain"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domains List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Domains</h2>
              
              {domains.length === 0 ? (
                <p className="text-gray-500">No domains found. Add your first domain!</p>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div 
                      key={domain._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedDomain?._id === domain._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleDomainSelect(domain)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-mono font-bold text-gray-800">
                          {domain.domain}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          domain.isVerified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {domain.isVerified ? "Verified" : "Pending Verification"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>Created: {formatDate(domain.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>Emails: {domain.emails.length}</span>
                        </div>
                        
                        <button 
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            domain.isVerified
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          } disabled:bg-gray-300`}
                          disabled={domain.isVerified || verifying[domain._id]}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyDomain(domain._id, domain.domain);
                          }}
                        >
                          {verifying[domain._id] ? "Verifying..." : domain.isVerified ? "Verified" : "Verify"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Prefixes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
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
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1 relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button
                        onClick={handleAddEmailPrefix}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {emailPrefixes.map((email, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-mono">{email.fullEmail}</span>
                        <button
                          onClick={() => handleRemoveEmailPrefix(email.prefix)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Select a domain to manage email prefixes</p>
              )}
            </div>
          </div>

          {/* Domain Analytics */}
          {selectedDomain && domainAnalytics && (
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Domain Analytics - {selectedDomain.domain}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Total Emails</h3>
                  <p className="text-2xl font-bold text-blue-600">{domainAnalytics.totalEmails}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Sent</h3>
                  <p className="text-2xl font-bold text-green-600">{domainAnalytics.sentEmails}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Received</h3>
                  <p className="text-2xl font-bold text-purple-600">{domainAnalytics.receivedEmails}</p>
                </div>
              </div>

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
            </div>
          )}

          {/* Email Analytics */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Email Analytics</h2>
            
            <div className="mb-4 flex gap-4 items-center">
              <select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Load Analytics
                </button>
              )}
            </div>

            {analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">Total Emails</h3>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalEmails}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800">Sent</h3>
                    <p className="text-2xl font-bold text-green-600">{analytics.sentEmails}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800">Received</h3>
                    <p className="text-2xl font-bold text-purple-600">{analytics.receivedEmails}</p>
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
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Send Email</h2>
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {showEmailForm ? 'Cancel' : 'Compose Email'}
              </button>
            </div>

            {showEmailForm && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    value={emailForm.from}
                    onChange={(e) => setEmailForm({...emailForm, from: e.target.value})}
                    placeholder="From (your email)"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    value={emailForm.to}
                    onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                    placeholder="To"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={emailForm.text}
                  onChange={(e) => setEmailForm({...emailForm, text: e.target.value})}
                  placeholder="Email content"
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendEmail}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Send Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Email Deletion</h3>
            <p className="text-gray-600 mb-4">
              We'll send an OTP to your email to confirm the deletion of <strong>{otpEmail}</strong>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyOtpAndDelete}
                  disabled={otpLoading || !otpCode.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  {otpLoading ? "Verifying..." : "Delete Email"}
                </button>
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                    setOtpEmail("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
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