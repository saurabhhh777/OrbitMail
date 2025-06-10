import { useState } from "react";
import { ChevronDown, Mail, Shield, Zap, Users, Globe } from "lucide-react";

const faqs = [
  {
    question: "Do I need to own a domain to use OrbitMail?",
    answer:
      "Yes. You'll need to connect a domain you already own (e.g. from GoDaddy, Namecheap, etc.) to start using custom emails like you@yourdomain.com.",
    icon: Globe,
    iconColor: "text-blue-500"
  },
  {
    question: "Can I use OrbitMail with Gmail or Outlook?",
    answer:
      "Yes! You can forward emails to Gmail or Outlook, and even send using their SMTP with your OrbitMail address if you prefer.",
    icon: Mail,
    iconColor: "text-red-500"
  },
  {
    question: "Is it really free? What's the catch?",
    answer:
      "Yes — we offer up to 5 email addresses completely free, no credit card required. Paid plans unlock advanced features and more addresses.",
    icon: Shield,
    iconColor: "text-green-500"
  },
  {
    question: "How hard is DNS setup?",
    answer:
      "It's very simple — we provide step-by-step instructions for your DNS provider. Most users are verified within 5 minutes.",
    icon: Zap,
    iconColor: "text-yellow-500"
  },
  {
    question: "Can I create team/shared inboxes?",
    answer:
      "Absolutely. You can set up aliases like team@yourdomain.com, support@yourdomain.com, and route them wherever you need.",
    icon: Users,
    iconColor: "text-purple-500"
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about getting started with OrbitMail
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "ring-2 ring-indigo-500" : "hover:shadow-xl"
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${faq.iconColor} bg-opacity-10 flex items-center justify-center mt-1`}>
                    <faq.icon className={`w-5 h-5 ${faq.iconColor}`} />
                  </div>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`ml-4 transition-transform flex-shrink-0 ${
                    activeIndex === index ? "rotate-180" : ""
                  } text-gray-400`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 ml-14 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl px-8 py-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Still have questions?</h3>
              <p className="text-gray-600 dark:text-gray-400">Our support team is here to help</p>
            </div>
            <a 
              href="/contact" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}