
import { Mail, ShieldCheck, Server } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Create Emails for Your Own Domain</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          OrbitalMail lets you create & manage custom email addresses like <strong>you@yourdomain.com</strong> — fully branded, fully yours.
        </p>
        <button className="text-lg px-8 py-5 rounded-xl shadow-md">Get Started</button>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-gray-100 shadow-sm">
            <Server size={40} className="mx-auto text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold">Connect Domain</h3>
            <p className="text-sm mt-2">Add your domain and update MX records. We’ll verify it’s yours.</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-100 shadow-sm">
            <Mail size={40} className="mx-auto text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold">Create Mailboxes</h3>
            <p className="text-sm mt-2">Choose up to 5 custom prefixes like founder@yourdomain.com.</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-100 shadow-sm">
            <ShieldCheck size={40} className="mx-auto text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold">Send & Receive Emails</h3>
            <p className="text-sm mt-2">Use our secure servers to handle all your mail traffic.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why OrbitalMail?</h2>
        <ul className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <li className="p-4 bg-white rounded-xl shadow border">
            ✅ Custom Email per Domain – Unlimited Domains
          </li>
          <li className="p-4 bg-white rounded-xl shadow border">
            ✅ Fully Managed SMTP/IMAP Servers
          </li>
          <li className="p-4 bg-white rounded-xl shadow border">
            ✅ Real-time Email Delivery & Parsing
          </li>
          <li className="p-4 bg-white rounded-xl shadow border">
            ✅ Free DNS/MX Verification Guide
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OrbitalMail. All rights reserved.
      </footer>
    </main>
  );
}
