import { Github, Mail, Twitter, Linkedin } from "lucide-react";
import Logo from "../assets/android-chrome-192x192.png";
import { userAuthStore } from "../../store/userAuthStore";

export default function Footer() {
  const { isDarkMode } = userAuthStore();
  return (
    <footer className={`px-6 md:px-12 py-16 rounded-2xl transition-colors duration-200 ${
      isDarkMode 
        ? "text-[#FAFAFA] border-[#262626] bg-[#171717]" 
        : "text-[#0A0A0A] border-[#E5E5E5] bg-[#F5F5F5]"
    } border`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-colors duration-200 ${
        isDarkMode ? "bg-[#171717]" : "bg-[#F5F5F5]"
      }`}>
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

              <h2 className={`text-2xl font-bold font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>OrbitMail</h2>
            </div>
            <p className={`max-w-xs mb-6 font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Professional email on your domain with zero clutter and full
              control.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/your-org/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 border-2 flex items-center justify-center transition-colors rounded-2xl ${
                  isDarkMode
                    ? "border-[#525252] bg-[#262626] hover:bg-[#404040] hover:text-[#FAFAFA] text-[#A3A3A3]"
                    : "border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A]"
                }`}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 border-2 flex items-center justify-center transition-colors rounded-2xl ${
                  isDarkMode
                    ? "border-[#525252] bg-[#262626] hover:bg-[#404040] hover:text-[#FAFAFA] text-[#A3A3A3]"
                    : "border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A]"
                }`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 border-2 flex items-center justify-center transition-colors rounded-2xl ${
                  isDarkMode
                    ? "border-[#525252] bg-[#262626] hover:bg-[#404040] hover:text-[#FAFAFA] text-[#A3A3A3]"
                    : "border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A]"
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:support@orbitmail.com"
                className={`w-10 h-10 border-2 flex items-center justify-center transition-colors rounded-2xl ${
                  isDarkMode
                    ? "border-[#525252] bg-[#262626] hover:bg-[#404040] hover:text-[#FAFAFA] text-[#A3A3A3]"
                    : "border-[#0A0A0A] bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] text-[#0A0A0A]"
                }`}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={`font-bold mb-4 text-lg font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-bold mb-4 text-lg font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/blog"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/roadmap"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className={`font-bold mb-4 text-lg font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Legal</h4>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="/terms"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  className={`hover:underline transition-colors font-jost ${
                    isDarkMode 
                      ? "text-[#A3A3A3] hover:text-[#FAFAFA]" 
                      : "text-[#525252] hover:text-[#0A0A0A]"
                  }`}
                >
                  Security
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className={`font-bold mb-4 text-lg font-poppins ${
                isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
              }`}>
                Stay Updated
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className={`px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#3B82F6] rounded transition-colors ${
                    isDarkMode 
                      ? "bg-[#262626] border-2 border-[#404040] text-[#FAFAFA] placeholder-[#8A8A8A]" 
                      : "bg-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] placeholder-[#737373]"
                  }`}
                />
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded border-2 font-poppins ${
                  isDarkMode
                    ? "bg-[#0A0A0A] hover:bg-[#262626] border-[#0A0A0A] text-[#FAFAFA]"
                    : "bg-[#0A0A0A] hover:bg-[#262626] border-[#0A0A0A] text-[#FAFAFA]"
                }`}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className={`mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDarkMode ? "border-[#262626]" : "border-[#E5E5E5]"
        } border-t`}>
          <p className={`text-sm font-jost ${
            isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
          }`}>
            © {new Date().getFullYear()} OrbitMail. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
