import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userAuthStore } from "../../store/userAuthStore";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

interface EmailForm {
  to: string;
  subject: string;
  text: string;
  from: string;
}

const ComposeEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendEmail, getAllDomain, isDarkMode } = userAuthStore();
  
  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: "",
    subject: "",
    text: "",
    from: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [availableEmails, setAvailableEmails] = useState<string[]>([]);

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    // Check if from email is provided in URL params
    const fromEmail = searchParams.get('from');
    if (fromEmail) {
      setEmailForm(prev => ({ ...prev, from: fromEmail }));
    }
  }, [searchParams]);

  // Update from email when availableEmails changes and no from email is set
  useEffect(() => {
    if (availableEmails.length > 0 && !emailForm.from) {
      setEmailForm(prev => ({ ...prev, from: availableEmails[0] }));
    }
  }, [availableEmails, emailForm.from]);

  const loadDomains = async () => {
    try {
      const response = await getAllDomain();
      if (response?.domains) {
        setDomains(response.domains);
        
        // Extract all available email addresses from verified domains
        const emails: string[] = [];
        response.domains.forEach((domain: any) => {
          if (domain.isVerified && domain.emails) {
            domain.emails.forEach((email: any) => {
              emails.push(email.fullEmail);
            });
          }
        });
        setAvailableEmails(emails);
        
        // Auto-select first available email if no from email is set
        if (emails.length > 0 && !emailForm.from) {
          setEmailForm(prev => ({ ...prev, from: emails[0] }));
        }
      }
    } catch (error: any) {
      console.error("Error loading domains:", error);
      toast.error("Failed to load domains");
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.text || !emailForm.from) {
      toast.error("Please fill all email fields");
      return;
    }

    try {
      setLoading(true);
      const res = await sendEmail(emailForm);
      if (res?.success) {
        toast.success("Email sent successfully");
        navigate('/dashboard');
      } else {
        toast.error("Failed to send email");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
    }`}>
      <Navbar />
      <div className="p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className={`flex items-center mr-4 transition-colors ${
                isDarkMode 
                  ? "text-[#A3A3A3] hover:text-[#D4D4D4]" 
                  : "text-[#525252] hover:text-[#404040]"
              }`}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className={`text-3xl font-bold font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Compose Email</h1>
          </div>

          {/* Email Form */}
          <div className={`rounded-lg shadow p-6 border transition-colors duration-200 ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <div className="space-y-6">
              {/* From Email */}
              <div>
                <label className={`block text-sm font-medium font-poppins mb-2 ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>
                  From Email
                </label>
                <select
                  value={emailForm.from}
                  onChange={(e) => setEmailForm({...emailForm, from: e.target.value})}
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A]"
                  }`}
                  disabled={availableEmails.length === 0}
                >
                  <option value="">Select from email</option>
                  {availableEmails.map((email, index) => (
                    <option key={index} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
                {availableEmails.length === 0 && (
                  <p className="text-sm text-[#EF4444] mt-1 font-jost">
                    No verified email addresses available. Please verify a domain first.
                  </p>
                )}
              </div>

              {/* To Email */}
              <div>
                <label className={`block text-sm font-medium font-poppins mb-2 ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>
                  To Email
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  placeholder="recipient@example.com"
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                />
              </div>

              {/* Subject */}
              <div>
                <label className={`block text-sm font-medium font-poppins mb-2 ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject"
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                />
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-medium font-poppins mb-2 ${
                  isDarkMode ? "text-[#D4D4D4]" : "text-[#404040]"
                }`}>
                  Message
                </label>
                <textarea
                  value={emailForm.text}
                  onChange={(e) => setEmailForm({...emailForm, text: e.target.value})}
                  placeholder="Write your email message here..."
                  rows={8}
                  className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors resize-vertical ${
                    isDarkMode 
                      ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2 border rounded transition-colors font-medium ${
                    isDarkMode
                      ? "border-[#404040] text-[#D4D4D4] hover:bg-[#262626]"
                      : "border-[#D4D4D4] text-[#404040] hover:bg-[#F5F5F5]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={loading || !emailForm.from}
                  className={`px-6 py-2 rounded transition-colors font-medium ${
                    loading || !emailForm.from
                      ? "bg-[#737373] text-[#FAFAFA] cursor-not-allowed"
                      : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
                  }`}
                >
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail; 