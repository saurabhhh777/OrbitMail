
import { userAuthStore } from "../../store/userAuthStore";

export default function FeaturesSection() {
  const { isDarkMode } = userAuthStore();

  const features = [
    {
      title: "Custom Domain Email",
      description: "Send and receive email from your own domain, like you@yourdomain.com — no Gmail branding.",
      buttonText: "Setup",
      icon: (
        <div className="relative">
          <div className="w-20 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
            <span className="text-white font-bold">@</span>
          </div>
          <div className="w-16 h-2 bg-gray-400 rounded-full mx-auto mb-1" />
          <div className="w-12 h-2 bg-gray-300 rounded-full mx-auto" />
        </div>
      ),
      dotPattern: "● ● ●"
    },
    {
      title: "Simple DNS Setup",
      description: "Easy domain verification with step-by-step DNS instructions. Get verified in minutes, not hours.",
      buttonText: "Connect",
      icon: (
        <div className="relative">
          <div className="w-16 h-20 bg-gray-800 rounded-lg flex flex-col items-center justify-center mr-4">
            <div className="w-2 h-2 bg-white rounded-full mb-2" />
            <div className="w-8 h-1 bg-white rounded mb-1" />
            <div className="w-6 h-1 bg-white rounded mb-1" />
            <div className="w-4 h-1 bg-white rounded" />
          </div>
          <div className="absolute top-4 -right-2 w-12 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-1 bg-white rounded" />
          </div>
        </div>
      ),
      dotPattern: "● ● ●"
    },
    {
      title: "Built-in Security",
      description: "Enterprise-grade security with spam protection, encryption, and reliable email delivery worldwide.",
      buttonText: "Secure",
      icon: (
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-800 rounded-full flex items-center justify-center">
            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-1 bg-white rounded" />
          </div>
        </div>
      ),
      dotPattern: "● ● ●"
    }
  ];

  return (
    <section className={`min-h-screen py-20 px-6 transition-colors duration-200 ${
      isDarkMode ? "bg-[#171717]" : "bg-[#F5F5F5]"
    }`} id="features">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Everything you need for
            <br />
            professional email
          </h2>
          <p className={`text-xl max-w-2xl mx-auto font-jost ${
            isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
          }`}>
            OrbitMail provides all the tools to create, manage, and scale your business email infrastructure.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => (
            <div
              key={`feature-${feature.title}`}
              className={`rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group border ${
                isDarkMode 
                  ? "bg-[#262626] border-[#404040] shadow-[#0A0A0A]/20" 
                  : "bg-[#FFFFFF] border-[#E5E5E5] shadow-[#0A0A0A]/10"
              }`}
            >
              {/* Icon */}
              <div className="mb-12 flex justify-center">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h3 className={`text-2xl font-bold font-poppins ${
                  isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                }`}>
                  {feature.title}
                </h3>

                <p className={`leading-relaxed font-jost ${
                  isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
                }`}>
                  {feature.description}
                </p>
              </div>

              {/* Bottom Section */}
              <div className={`flex items-center justify-between mt-12 pt-6 border-t ${
                isDarkMode ? "border-[#404040]" : "border-[#E5E5E5]"
              }`}>
                <div className="flex space-x-2">
                  {feature.dotPattern.split(' ').map((dot, dotIndex) => (
                    <span
                      key={`dot-${feature.title}-${dotIndex}`}
                      className={`text-lg ${
                        dotIndex === 2 
                          ? isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
                          : isDarkMode ? "text-[#525252]" : "text-[#D4D4D4]"
                      }`}
                    >
                      {dot}
                    </span>
                  ))}
                </div>

                <button className={`flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-300 group font-poppins ${
                  isDarkMode ? "text-[#3B82F6] hover:text-[#60A5FA]" : "text-[#3B82F6] hover:text-[#2563EB]"
                }`}>
                  <span>{feature.buttonText}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`rounded-3xl p-12 text-center shadow-lg border transition-colors duration-200 ${
          isDarkMode 
            ? "bg-[#262626] border-[#404040] shadow-[#0A0A0A]/20" 
            : "bg-[#FFFFFF] border-[#E5E5E5] shadow-[#0A0A0A]/10"
        }`}>
          <div className="max-w-3xl mx-auto">
            <h3 className={`text-3xl lg:text-4xl font-bold mb-6 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>
              Ready to get started with OrbitMail?
            </h3>
            <p className={`text-xl mb-8 font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Join thousands of businesses using professional email addresses on their custom domains.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className={`px-8 py-4 rounded-full transition-colors font-semibold text-lg font-poppins ${
                isDarkMode 
                  ? "bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]" 
                  : "bg-[#0A0A0A] text-[#FAFAFA] hover:bg-[#262626]"
              }`}>
                Start Free Trial
              </button>
              <button className={`px-8 py-4 rounded-full transition-colors font-semibold text-lg font-poppins border-2 ${
                isDarkMode
                  ? "border-[#525252] text-[#D4D4D4] hover:border-[#8A8A8A]"
                  : "border-[#D4D4D4] text-[#404040] hover:border-[#0A0A0A]"
              }`}>
                Book a Demo
              </button>
            </div>

            <p className={`text-sm mt-6 font-jost ${
              isDarkMode ? "text-[#8A8A8A]" : "text-[#737373]"
            }`}>
              Free for 5 email addresses • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
