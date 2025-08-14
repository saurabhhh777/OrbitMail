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
  const { sendEmail, getAllDomain } = userAuthStore();
  
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <Toaster />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Compose Email</h1>
          </div>

          {/* Email Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              {/* From Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <select
                  value={emailForm.from}
                  onChange={(e) => setEmailForm({...emailForm, from: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <p className="text-sm text-red-600 mt-1">
                    No verified email addresses available. Please verify a domain first.
                  </p>
                )}
              </div>

              {/* To Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Email
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  placeholder="recipient@example.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailForm.text}
                  onChange={(e) => setEmailForm({...emailForm, text: e.target.value})}
                  placeholder="Write your email message here..."
                  rows={8}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={loading || !emailForm.from}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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