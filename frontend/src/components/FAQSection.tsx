import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { userAuthStore } from "../../store/userAuthStore";

const faqs = [
  {
    question: "Do I need to own a domain to use OrbitMail?",
    answer:
      "Yes. You'll need to connect a domain you already own (e.g. from GoDaddy, Namecheap, etc.) to start using custom emails like you@yourdomain.com.",
  },
  {
    question: "Can I use OrbitMail with Gmail or Outlook?",
    answer:
      "Yes! You can forward emails to Gmail or Outlook, and even send using their SMTP with your OrbitMail address if you prefer.",
  },
  {
    question: "Is it really free? What's the catch?",
    answer:
      "Yes — we offer up to 5 email addresses completely free, no credit card required. Paid plans unlock advanced features and more addresses.",
  },
  {
    question: "How hard is DNS setup?",
    answer:
      "It's very simple — we provide step-by-step instructions for your DNS provider. Most users are verified within 5 minutes.",
  },
  {
    question: "Can I create team/shared inboxes?",
    answer:
      "Absolutely. You can set up aliases like team@yourdomain.com, support@yourdomain.com, and route them wherever you need.",
  },
];

export default function FAQSection() {
  const { isDarkMode } = userAuthStore();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className={`py-20 px-6 transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
    }`} id="faq">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className={`text-sm font-medium mb-4 tracking-wider uppercase font-poppins ${
            isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
          }`}>
            TRUSTED BY
          </p>
          <h2 className={`text-4xl font-light mb-2 tracking-tight font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Frequently
          </h2>
          <h2 className={`text-4xl font-light tracking-tight font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Asked Questions
          </h2>
        </div>

        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-b last:border-b-0 transition-colors duration-200 ${
                isDarkMode 
                  ? "bg-[#171717] border-[#262626]" 
                  : "bg-[#FFFFFF] border-[#E5E5E5]"
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className={`w-full flex justify-between items-center py-6 px-6 text-left transition-colors duration-200 ${
                  isDarkMode 
                    ? "hover:bg-[#262626]" 
                    : "hover:bg-[#F5F5F5]"
                }`}
              >
                <span className={`font-medium text-lg pr-4 font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>
                  {faq.question}
                </span>
                {activeIndex === index ? (
                  <Minus className={`w-5 h-5 flex-shrink-0 ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                  }`} />
                ) : (
                  <Plus className={`w-5 h-5 flex-shrink-0 ${
                    isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                  }`} />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className={`px-6 pb-6 leading-relaxed font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
