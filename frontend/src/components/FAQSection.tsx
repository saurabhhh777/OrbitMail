import { useState } from "react";
import { Plus, Minus } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className="bg-gray-50 py-20 px-6" id="faq">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-gray-500 mb-4 tracking-wider uppercase">
            TRUSTED BY
          </p>
          <h2 className="text-4xl font-light text-black mb-2 tracking-tight font-poppins">
            Frequently
          </h2>
          <h2 className="text-4xl font-light text-black tracking-tight font-poppins">
            Asked Questions
          </h2>
        </div>

        <div className="space-y-1 font-poppins">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center py-6 px-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-medium text-black text-lg pr-4">
                  {faq.question}
                </span>
                {activeIndex === index ? (
                  <Minus className="w-5 h-5 text-black flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-black flex-shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
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
