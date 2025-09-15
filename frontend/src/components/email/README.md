// Example usage of the Mailbox UI components
// Add this to your main App.tsx or create a new page component

import React from "react";
import { MailboxLayout } from "./components/email";
import { userAuthStore } from "./store/userAuthStore";

const MailboxPage: React.FC = () => {
  const { isDarkMode } = userAuthStore();

  return (
    <div className="h-screen">
      <MailboxLayout isDarkMode={isDarkMode} />
    </div>
  );
};

export default MailboxPage;

// Alternative: If you want to add it to your existing Dashboard
// import { MailboxLayout } from "./components/email";

// In your Dashboard component:
// const Dashboard = () => {
//   const { isDarkMode } = userAuthStore();
//   
//   return (
//     <div>
//       {/* Your existing dashboard content */}
//       <MailboxLayout isDarkMode={isDarkMode} />
//     </div>
//   );
// };

// API Integration Notes:
// 1. Update EmailList.tsx to use real API calls:
//    - Replace mock data with actual API calls to POST /api/v1/email/get
//    - Pass { folder: "inbox" | "sent" | "drafts" | "spam" | "trash" } in request body
//
// 2. Update ComposeModal.tsx to use real API calls:
//    - Replace mock API call with actual call to POST /api/v1/email/send
//    - Pass { to, from, subject, text } in request body
//
// 3. Add authentication headers to API calls using your existing axiosInstance
//
// 4. Handle loading states and error messages appropriately
//
// 5. Implement real-time updates using WebSocket or polling if needed
