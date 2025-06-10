export default function CtaSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 rounded-3xl my-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br bg-[#0E1625] dark:from-indigo-700 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-indigo-400/20 dark:bg-indigo-700/20 z-0"></div>
      <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-purple-400/20 dark:bg-purple-700/20 z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-white/20 z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
          <span className="text-white/90 font-medium">Ready to get started?</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Claim your professional email identity <span className="text-indigo-200">today</span>
        </h2>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-10 inline-block max-w-2xl">
          <p className="text-2xl text-white font-mono tracking-tight">
            you@<span className="text-indigo-200">yourdomain.com</span>
          </p>
        </div>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Get set up in minutes with our guided onboarding. No technical skills needed.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/signup"
            className="relative bg-white text-indigo-600 hover:text-indigo-700 font-semibold text-lg px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg z-10"
          >
            Create Your First Email
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">
              FREE
            </span>
          </a>
          <a
            href="/demo"
            className="bg-transparent text-white font-semibold text-lg px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white/60 transition-colors"
          >
            Watch Demo Video
          </a>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free for up to 5 addresses</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>5-minute setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}