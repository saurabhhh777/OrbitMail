import { userAuthStore } from "../../store/userAuthStore";
import Navbar from "./Navbar";
import {Link} from "react-router-dom";


export default function HeroSection() {
  const { isDarkMode} = userAuthStore();

  return (
    <section className={`${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"} min-h-screen`}>
      {/* Navigation Header */}
      <Navbar/>


      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto px-8 lg:px-16 pt-20 pb-16">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 font-poppins">
            Powerful email
            <br />
            hosting for businesses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 font-poppins">
            Create, manage, and scale professional email addresses on your
            custom domain - All in one workspace.
          </p>
          <Link to="/dashboard">
          <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg hover:opacity-90 transition-colors font-medium text-lg">
            Get Started
          </button>
          </Link>
        </div>

        {/* Workflow Visualization */}
        <div className={`relative rounded-2xl shadow-lg p-12 mb-20 font-poppins ${isDarkMode ? "bg-[#262626]" : "bg-white"}`}>
          <div className="flex items-center justify-between relative">
            {/* Step: Connect */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-sm text-gray-500 max-w-24">Link your domain</p>
            </div>

            <div className="flex-1 h-px bg-gray-300 mx-8 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-2 h-2 rounded-full" />
            </div>

            {/* Step: Configure */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..." />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Configure</h3>
              <p className="text-sm text-gray-500 max-w-24">Setup email accounts</p>
            </div>

            <div className="flex-1 h-px bg-gray-300 mx-8 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-2 h-2 rounded-full" />
            </div>

            {/* Step: Send */}
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Send</h3>
              <p className="text-sm text-gray-500 max-w-24">Start emailing</p>
            </div>
          </div>

          {/* Email Examples */}
          <div className={`mt-12 rounded-xl p-8 ${isDarkMode ? "bg-[#262626]" : "bg-gray-50"}`}>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Show me a list of contacts that haven't signed in the last 10 days
              </p>
            </div>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {["founder@", "team@", "support@", "sales@"].map((prefix, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 shadow-sm border text-center min-w-[140px] ${isDarkMode ? "bg-[#222222] border-gray-700" : "bg-white"}`}
                >
                  <div className="text-sm font-medium">{prefix}</div>
                  <div className="text-xs text-gray-500">yourdomain.com</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8..." />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute -left-8 top-1/4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center transform rotate-12">
              <span className="text-white text-xs font-bold">M</span>
            </div>
          </div>
          <div className="absolute -right-8 top-1/3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center transform -rotate-12">
              <span className="text-white text-xs font-bold">@</span>
            </div>
          </div>
          <div className="absolute -left-4 bottom-1/4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
          </div>
          <div className="absolute -right-4 bottom-1/3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-8">
            Backed by premier investors and operators
          </p>
          <div className="flex items-center justify-center gap-12 opacity-60 flex-wrap">
            {["Microsoft", "Google", "Amazon", "Stripe", "Vercel", "Shopify"].map((company, i) => (
              <div key={i} className="text-gray-400 font-medium text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
