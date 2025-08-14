// components/SupportPage.tsx

import { Search, Mail, HelpCircle, User, Shield } from "lucide-react";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { userAuthStore } from "../../store/userAuthStore";

export default function Support() {
  const { isDarkMode } = userAuthStore();
  return (
    <div>
      <Navbar/>
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#0A0A0A]"
    }`}>
      {/* Header */}
      <header className={`py-10 text-center shadow transition-colors duration-200 ${
        isDarkMode 
          ? "bg-[#171717] text-[#FAFAFA]" 
          : "bg-[#FFFFFF] text-[#0A0A0A]"
      } font-poppins`}>
        <h1 className={`text-4xl font-bold font-poppins ${
          isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
        }`}>OrbitMail Support</h1>
        <p className={`mt-2 text-lg font-jost ${
          isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
        }`}>We're here to help you get the most out of OrbitMail.</p>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mt-6 px-4">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for help articles..."
            className={`w-full px-5 py-3 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-colors ${
              isDarkMode 
                ? "border-[#404040] bg-[#262626] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                : "border-[#D4D4D4] bg-[#FFFFFF] text-[#0A0A0A] placeholder-[#737373]"
            }`}
            />
          <Search className={`absolute right-4 top-3 ${
            isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
          }`} />
        </div>
      </div>

      {/* Help Topics */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8 max-w-6xl mx-auto">
        {[
          { icon: Mail, title: "Sending & Receiving", desc: "Troubleshoot email delivery issues." },
          { icon: User, title: "Account Setup", desc: "How to create and manage your OrbitMail accounts." },
          { icon: Shield, title: "Security & Privacy", desc: "Learn how we keep your data secure." },
          { icon: HelpCircle, title: "Other Issues", desc: "Still stuck? Reach out directly." }
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow hover:shadow-lg transition-colors duration-200 border ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
              : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
          }`}>
            <Icon className="text-[#3B82F6] mb-3" size={28} />
            <h3 className={`font-semibold text-lg font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>{title}</h3>
            <p className={`text-sm mt-1 font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>{desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
        <FAQSection/>

      {/* Contact Support */}
      <section className={`mt-12 py-10 text-center shadow-inner transition-colors duration-200 ${
        isDarkMode 
          ? "bg-[#171717] text-[#FAFAFA]" 
          : "bg-[#FFFFFF] text-[#0A0A0A]"
      }`}>
        <h3 className={`text-2xl font-bold mb-2 font-poppins ${
          isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
        }`}>Still need help?</h3>
        <p className={`mb-4 font-jost ${
          isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
        }`}>Our team is here for you — usually replies within 24 hours.</p>
        <a
          href="mailto:support@orbitmail.fun"
          className={`inline-block px-6 py-3 rounded-full font-medium transition-colors font-poppins ${
            isDarkMode
              ? "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
              : "bg-[#3B82F6] hover:bg-[#2563EB] text-[#FAFAFA]"
          }`}
          >
          Contact Support
        </a>
      </section>

      {/* Footer */}
        <Footer/>

    </div>
    </div>
  );
}
