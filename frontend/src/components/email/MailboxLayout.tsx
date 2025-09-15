import React, { useState } from "react";
import { Plus, Mail, Settings, User } from "lucide-react";
import EmailSidebar from "./EmailSidebar";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";
import ComposeModal from "./ComposeModal";

export type Folder = "inbox" | "sent" | "drafts" | "spam" | "trash";

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  folder: Folder;
}

interface MailboxLayoutProps {
  isDarkMode?: boolean;
}

const MailboxLayout: React.FC<MailboxLayoutProps> = ({ isDarkMode = false }) => {
  const [selectedFolder, setSelectedFolder] = useState<Folder>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setSelectedEmail(null);
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleComposeOpen = () => {
    setIsComposeOpen(true);
  };

  const handleComposeClose = () => {
    setIsComposeOpen(false);
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Mail className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              OrbitMail
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleComposeOpen}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </button>

          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}>
            <Settings className="w-5 h-5" />
          </button>

          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}>
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-64 border-r ${
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <EmailSidebar
            selectedFolder={selectedFolder}
            onFolderSelect={handleFolderSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={handleBackToList}
              isDarkMode={isDarkMode}
            />
          ) : (
            <EmailList
              folder={selectedFolder}
              onEmailSelect={handleEmailSelect}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {isComposeOpen && (
        <ComposeModal
          onClose={handleComposeClose}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default MailboxLayout;
