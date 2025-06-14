import { Github, Mail, Twitter, Linkedin } from "lucide-react";
import Logo from "../assets/android-chrome-192x192.png";

export default function Footer() {
  return (
    <footer className="text-black px-6 md:px-12 py-16 border-black bg-[#f3f4f6] rounded-2xl">
      <div className="max-w-7xl mx-auto bg-[#f3f4f6] rounded-2xl">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Branding & Social */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src={Logo}
                  alt="OrbitMail Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-black">OrbitMail</h2>
            </div>
            <p className="max-w-xs text-gray-600 mb-6">
              Professional email on your domain with zero clutter and full
              control.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/your-org/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors rounded-2xl"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors rounded-2xl"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors rounded-2xl"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:support@orbitmail.com"
                className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white flex items-center justify-center transition-colors rounded-2xl"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-black mb-4 text-lg">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-black mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/blog"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/roadmap"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="font-bold text-black mb-4 text-lg">Legal</h4>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  className="text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-bold text-black mb-4 text-lg">
                Stay Updated
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white border-2 border-black px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                />
                <button className="bg-black hover:bg-white hover:text-black border-2 border-black text-white px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16  border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} OrbitMail. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
