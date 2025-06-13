import Logo from "../assets/android-chrome-192x192.png";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-8 lg:px-16 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={Logo}
              alt="OrbitMail Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-2xl font-bold text-black font-poppins">
            OrbitMail
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 font-poppins">
          <button className="text-gray-600 hover:text-black transition-colors font-medium">
            Solution
          </button>
          <button className="text-gray-600 hover:text-black transition-colors font-medium">
            Pricing
          </button>
          <button className="text-gray-600 hover:text-black transition-colors font-medium">
            Docs
          </button>
          <button className="text-gray-600 hover:text-black transition-colors font-medium">
            Support
          </button>
        </div>

        <div className="flex items-center space-x-4 font-poppins">
          <button className="text-gray-600 hover:text-black transition-colors font-medium">
            Sign In
          </button>
          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Book a demo
          </button>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto px-8 lg:px-16 pt-20 pb-16">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight mb-6 font-poppins">
            Powerful email
            <br />
            hosting for businesses
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 font-poppins">
            Create, manage, and scale professional email addresses on your
            custom domain - All in one workspace.
          </p>

          <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg">
            Book a demo
          </button>
        </div>

        {/* Workflow Visualization */}
        <div className="relative bg-white rounded-2xl shadow-lg p-12 mb-20 font-poppins">
          {/* Flow Steps */}
          <div className="flex items-center justify-between relative">
            {/* Step 1: Connect Domain */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Connect</h3>
              <p className="text-sm text-gray-500 max-w-24">Link your domain</p>
            </div>

            {/* Connecting Line */}
            <div className="flex-1 h-px bg-gray-300 mx-8 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-2 h-2 rounded-full" />
            </div>

            {/* Step 2: Configure */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Configure</h3>
              <p className="text-sm text-gray-500 max-w-24">
                Setup email accounts
              </p>
            </div>

            {/* Connecting Line */}
            <div className="flex-1 h-px bg-gray-300 mx-8 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 w-2 h-2 rounded-full" />
            </div>

            {/* Step 3: Send */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Send</h3>
              <p className="text-sm text-gray-500 max-w-24">Start emailing</p>
            </div>
          </div>

          {/* Email Examples Flow */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Show me a list of contacts that haven't signed in the last 10
                days
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 flex-wrap">
              {/* Email Examples */}
              <div className="bg-white rounded-lg p-4 shadow-sm border text-center min-w-[140px]">
                <div className="text-sm font-medium text-black">founder@</div>
                <div className="text-xs text-gray-500">yourdomain.com</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border text-center min-w-[140px]">
                <div className="text-sm font-medium text-black">team@</div>
                <div className="text-xs text-gray-500">yourdomain.com</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border text-center min-w-[140px]">
                <div className="text-sm font-medium text-black">support@</div>
                <div className="text-xs text-gray-500">yourdomain.com</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border text-center min-w-[140px]">
                <div className="text-sm font-medium text-black">sales@</div>
                <div className="text-xs text-gray-500">yourdomain.com</div>
              </div>
            </div>

            {/* Central Email Icon */}
            <div className="flex justify-center mt-8">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Brand Icons */}
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
            {/* Company Logos Placeholders */}
            <div className="text-gray-400 font-medium text-lg">Microsoft</div>
            <div className="text-gray-400 font-medium text-lg">Google</div>
            <div className="text-gray-400 font-medium text-lg">Amazon</div>
            <div className="text-gray-400 font-medium text-lg">Stripe</div>
            <div className="text-gray-400 font-medium text-lg">Vercel</div>
            <div className="text-gray-400 font-medium text-lg">Shopify</div>
          </div>
        </div>
      </div>
    </section>
  );
}
