import { Github, Mail, Twitter, Linkedin, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300 px-6 md:px-12 py-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-900/10"></div>
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-purple-900/10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Branding & Social */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-indigo-500" size={24} />
              <h2 className="text-2xl font-bold text-white">OrbitMail</h2>
            </div>
            <p className="max-w-xs text-gray-400 mb-6">
              Professional email on your domain with zero clutter and full control.
            </p>
            
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/your-org/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/orbitmail"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:support@orbitmail.com"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Product</h4>
            <ul className="space-y-3">
              <li><a href="/features" className="hover:text-white hover:underline transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-white hover:underline transition-colors">Pricing</a></li>
              <li><a href="/docs" className="hover:text-white hover:underline transition-colors">Documentation</a></li>
              <li><a href="/faq" className="hover:text-white hover:underline transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/status" className="hover:text-white hover:underline transition-colors">System Status</a></li>
              <li><a href="/blog" className="hover:text-white hover:underline transition-colors">Blog</a></li>
              <li><a href="/support" className="hover:text-white hover:underline transition-colors">Support</a></li>
              <li><a href="/roadmap" className="hover:text-white hover:underline transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Legal</h4>
            <ul className="space-y-3 mb-8">
              <li><a href="/terms" className="hover:text-white hover:underline transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white hover:underline transition-colors">Privacy Policy</a></li>
              <li><a href="/security" className="hover:text-white hover:underline transition-colors">Security</a></li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-bold text-white mb-4 text-lg">Stay Updated</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} OrbitMail. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <a href="/cookies" className="text-gray-500 hover:text-gray-300">Cookie Policy</a>
            <a href="/dmca" className="text-gray-500 hover:text-gray-300">DMCA</a>
            <a href="/gdpr" className="text-gray-500 hover:text-gray-300">GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}