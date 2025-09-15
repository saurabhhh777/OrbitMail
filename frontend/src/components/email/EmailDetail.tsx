import React from "react";
import { ArrowLeft, Reply, ReplyAll, Forward, Trash2, Archive, Star, MoreVertical } from "lucide-react";
import { Email } from "./MailboxLayout";

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  isDarkMode?: boolean;
}

const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onBack,
  isDarkMode = false
}) => {
  const formatFullTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log("Reply to:", email.from);
  };

  const handleReplyAll = () => {
    // TODO: Implement reply all functionality
    console.log("Reply all to:", email.from);
  };

  const handleForward = () => {
    // TODO: Implement forward functionality
    console.log("Forward email:", email.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete email:", email.id);
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log("Archive email:", email.id);
  };

  const handleStar = () => {
    // TODO: Implement star functionality
    console.log("Star email:", email.id);
  };

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
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReply}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={handleReplyAll}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Reply All"
            >
              <ReplyAll className="w-4 h-4" />
            </button>
            <button
              onClick={handleForward}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Forward"
            >
              <Forward className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchive}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={handleStar}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-yellow-400 hover:bg-gray-700"
                  : "text-gray-600 hover:text-yellow-500 hover:bg-gray-100"
              }`}
              title="Star"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                  : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
              }`}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="More"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className={`flex-1 overflow-y-auto ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <div className="p-6">
          {/* Subject */}
          <h1 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            {email.subject}
          </h1>

          {/* Email Meta */}
          <div className={`border-b pb-4 mb-6 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    From:
                  </span>
                  <span className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {email.from}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    To:
                  </span>
                  <span className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {email.to}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Date:
                  </span>
                  <span className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {formatFullTimestamp(email.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className={`prose max-w-none ${
            isDarkMode ? "prose-invert" : ""
          }`}>
            <div className={`whitespace-pre-wrap ${
              isDarkMode ? "text-gray-300" : "text-gray-900"
            }`}>
              {email.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
