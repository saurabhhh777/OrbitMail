import React, { useState, useEffect } from "react";
import { Mail, Clock, Star, StarOff } from "lucide-react";
import { Email, Folder } from "./MailboxLayout";
import { axiosInstance } from "../../lib/axios";

interface EmailListProps {
  folder: Folder;
  onEmailSelect: (email: Email) => void;
  isDarkMode?: boolean;
}

const EmailList: React.FC<EmailListProps> = ({
  folder,
  onEmailSelect,
  isDarkMode = false
}) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockEmails: Email[] = [
    {
      id: "1",
      from: "john.doe@example.com",
      to: "user@orbitmail.com",
      subject: "Welcome to OrbitMail!",
      body: "Thank you for signing up to OrbitMail. We are excited to have you on board!",
      preview: "Thank you for signing up to OrbitMail. We are excited to have you on board!",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      folder: "inbox"
    },
    {
      id: "2",
      from: "support@orbitmail.com",
      to: "user@orbitmail.com",
      subject: "Your account has been verified",
      body: "Your email account has been successfully verified. You can now send and receive emails.",
      preview: "Your email account has been successfully verified. You can now send and receive emails.",
      timestamp: "2024-01-15T09:15:00Z",
      isRead: true,
      folder: "inbox"
    },
    {
      id: "3",
      from: "user@orbitmail.com",
      to: "client@company.com",
      subject: "Project Update",
      body: "Here is the latest update on our project progress...",
      preview: "Here is the latest update on our project progress...",
      timestamp: "2024-01-14T16:45:00Z",
      isRead: true,
      folder: "sent"
    }
  ];

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data
      // TODO: Replace with real API call
      // const response = await axiosInstance.post("/api/v1/email/get", {
      //   folder: folder
      // });
      // setEmails(response.data.emails || []);

      // Filter mock emails by folder
      const filteredEmails = mockEmails.filter(email => email.folder === folder);
      setEmails(filteredEmails);
    } catch (err) {
      setError("Failed to fetch emails");
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getFolderTitle = (folder: Folder) => {
    switch (folder) {
      case "inbox": return "Inbox";
      case "sent": return "Sent";
      case "drafts": return "Drafts";
      case "spam": return "Spam";
      case "trash": return "Trash";
      default: return "Inbox";
    }
  };

  if (loading) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading emails...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <p className={`${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            {error}
          </p>
          <button
            onClick={fetchEmails}
            className={`mt-4 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          {getFolderTitle(folder)}
        </h2>
        <p className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          {emails.length} email{emails.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}>
            <div className="text-center">
              <Mail className={`w-12 h-12 mx-auto mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`} />
              <p className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                No emails in {getFolderTitle(folder).toLowerCase()}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onEmailSelect(email)}
                className={`p-4 cursor-pointer transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-50"
                } ${
                  !email.isRead
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-white"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <button
                      className={`p-1 rounded-full transition-colors ${
                        isDarkMode
                          ? "text-gray-400 hover:text-yellow-400"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } ${!email.isRead ? "font-bold" : ""}`}>
                        {folder === "sent" ? email.to : email.from}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`} />
                        <span className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {formatTimestamp(email.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm truncate mt-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } ${!email.isRead ? "font-semibold" : ""}`}>
                      {email.subject}
                    </p>
                    
                    <p className={`text-sm truncate mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {email.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
