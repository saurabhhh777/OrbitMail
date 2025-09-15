import React, { useState } from "react";
import { X, Send, Paperclip, Bold, Italic, Link } from "lucide-react";

import { sendEmail } from "../../services/emailApi";
import { toast } from "react-hot-toast";

interface ComposeModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

const ComposeModal: React.FC<ComposeModalProps> = ({
  onClose,
  isDarkMode = false
}) => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: ""
  });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSending(true);
      
      // TODO: Replace with real API call
      // const response = await axiosInstance.post("/api/v1/email/send", {
      //   to: formData.to,
      //   from: "user@orbitmail.com", // Get from user context
      //   subject: formData.subject,
      //   text: formData.body
      // });

      const res = await sendEmail(formData.to, formData.subject, formData.body);
      if (res.success) {
        toast.success("Email sent successfully!");
        setFormData({ to: "", subject: "", body: "" });
        onClose();
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (formData.to || formData.subject || formData.body) {
      if (window.confirm("Are you sure you want to discard this email?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl h-5/6 rounded-lg shadow-xl ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Compose Email
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col p-4">
          {/* To Field */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              To
            </label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="recipient@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Subject Field */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Email subject"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Toolbar */}
          <div className={`flex items-center space-x-2 mb-4 p-2 border rounded-lg ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}>
            <button
              className={`p-2 rounded transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <div className={`w-px h-6 ${
              isDarkMode ? "bg-gray-600" : "bg-gray-300"
            }`}></div>
            <button
              className={`p-2 rounded transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Body Field */}
          <div className="flex-1 mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Message
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSend}
                disabled={isSending}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isSending
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? "Sending..." : "Send"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
