export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Professional Email
            </span>
            <br />
            On Your Own Domain
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ditch generic emails. Get <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">you@yourbusiness.com</span> in minutes with our simple, powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button className="relative bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5">
              Start Free Trial
              <span className="absolute -right-2 -top-2 bg-purple-500 text-xs text-white px-2 py-1 rounded-full shadow">14 days</span>
            </button>
            <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all">
              Watch Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((item) => (
                <img 
                  key={item}
                  src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item+20}.jpg`}
                  alt="Happy user"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
              ))}
            </div>
            <p className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              Trusted by <span className="font-semibold">5,000+</span> businesses
            </p>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl bg-indigo-200/30 dark:bg-indigo-900/20 -z-10"></div>
          <img
            src="/images/email-dashboard-mock.png"
            alt="Professional email dashboard"
            className="w-full max-w-lg rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 transform rotate-1 hover:rotate-0 transition-transform duration-300"
          />
          <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900 dark:text-white">Email delivered</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}