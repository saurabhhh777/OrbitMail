// components/SupportPage.tsx

import { Search, Mail, HelpCircle, User, Shield } from "lucide-react";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Support() {
  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="py-10 text-center bg-white shadow font-poppins">
        <h1 className="text-4xl font-bold">OrbitMail Support</h1>
        <p className="mt-2 text-lg text-gray-600">We're here to help you get the most out of OrbitMail.</p>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mt-6 px-4">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for help articles..."
            className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <Search className="absolute right-4 top-3 text-gray-400" />
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
          <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <Icon className="text-blue-500 mb-3" size={28} />
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
        <FAQSection/>

      {/* Contact Support */}
      <section className="mt-12 bg-white py-10 text-center shadow-inner">
        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
        <p className="text-gray-600 mb-4">Our team is here for you — usually replies within 24 hours.</p>
        <a
          href="mailto:support@orbitmail.fun"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
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
