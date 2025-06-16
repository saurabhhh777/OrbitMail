
export default function FeaturesSection() {

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
    <section className="min-h-screen bg-gray-100 py-20 px-6" id="features">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 font-poppins">
            Everything you need for
            <br />
            professional email
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-poppins">
            OrbitMail provides all the tools to create, manage, and scale your business email infrastructure.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20 font-poppins">
          {features.map((feature) => (
            <div
              key={`feature-${feature.title}`}
              className="bg-white rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Icon */}
              <div className="mb-12 flex justify-center">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-black">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                <div className="flex space-x-2">
                  {feature.dotPattern.split(' ').map((dot, dotIndex) => (
                    <span
                      key={`dot-${feature.title}-${dotIndex}`}
                      className={`text-lg ${dotIndex === 2 ? 'text-black' : 'text-gray-300'}`}
                    >
                      {dot}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all duration-300 group">
                  <span>{feature.buttonText}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-black mb-6">
              Ready to get started with OrbitMail?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of businesses using professional email addresses on their custom domains.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors font-semibold text-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-300 text-black px-8 py-4 rounded-full hover:border-black transition-colors font-semibold text-lg">
                Book a Demo
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Free for 5 email addresses • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
