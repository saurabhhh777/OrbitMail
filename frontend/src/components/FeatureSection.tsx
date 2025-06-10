import { ShieldCheck, Mail, Server, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Mail,
      title: "Custom Domain Email",
      description:
        "Send and receive email from your own domain, like you@yourdomain.com — no Gmail branding.",
    },
    {
      icon: ShieldCheck,
      title: "Simple DNS Verification",
      description:
        "Easy domain setup with step-by-step DNS instructions. Get verified in minutes.",
    },
    {
      icon: Server,
      title: "Built-in Inbox or Forwarding",
      description:
        "Use OrbitMail's inbox or forward messages to Gmail, Outlook, or anywhere else.",
    },
    {
      icon: Zap,
      title: "Flexible & Scalable",
      description:
        "Free for 5 email addresses. Upgrade anytime as your needs grow.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Email Made Simple
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-16">
            Everything you need to establish a credible email identity - without the complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                <feature.icon className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center max-w-5xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to elevate your professional identity?
            </h3>
            <p className="text-indigo-100 mb-6">
              Join thousands of businesses using OrbitMail for their professional communications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg">
                Get Started Free
              </button>
              <button className="text-white font-medium bg-indigo-600/20 hover:bg-indigo-600/30 px-6 py-3 rounded-lg transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}