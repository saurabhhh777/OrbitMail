import React from "react";
import { Inbox, Send, FileText, AlertTriangle, Trash2 } from "lucide-react";
import { Folder } from "./MailboxLayout";

interface EmailSidebarProps {
  selectedFolder: Folder;
  onFolderSelect: (folder: Folder) => void;
  isDarkMode?: boolean;
}

const EmailSidebar: React.FC<EmailSidebarProps> = ({
  selectedFolder,
  onFolderSelect,
  isDarkMode = false
}) => {
  const folders = [
    { id: "inbox" as Folder, label: "Inbox", icon: Inbox, count: 12 },
    { id: "sent" as Folder, label: "Sent", icon: Send, count: 8 },
    { id: "drafts" as Folder, label: "Drafts", icon: FileText, count: 3 },
    { id: "spam" as Folder, label: "Spam", icon: AlertTriangle, count: 0 },
    { id: "trash" as Folder, label: "Trash", icon: Trash2, count: 5 },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className={`p-4 border-b ${
        isDarkMode 
          ? "border-gray-700" 
          : "border-gray-200"
      }`}>
        <h2 className={`text-lg font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          Folders
        </h2>
      </div>

      <div className="flex-1 p-2">
        <nav className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isSelected = selectedFolder === folder.id;
            
            return (
              <button
                key={folder.id}
                onClick={() => onFolderSelect(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  isSelected
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-900"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isSelected
                      ? isDarkMode
                        ? "bg-blue-500 text-white"
                        : "bg-blue-200 text-blue-800"
                      : isDarkMode
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`p-4 border-t ${
        isDarkMode 
          ? "border-gray-700" 
          : "border-gray-200"
      }`}>
        <div className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          <div className="flex items-center justify-between">
            <span>Storage</span>
            <span>2.1 GB used</span>
          </div>
          <div className={`w-full h-2 rounded-full mt-2 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          }`}>
            <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSidebar;
