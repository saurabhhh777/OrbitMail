import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Pricing = () => {

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">

      

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Start for free. Upgrade when you're ready to unlock more power.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Free</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-base font-normal">/mo</span></p>
          <ul className="text-sm text-gray-600 mb-6 space-y-2">
            <li>✅ 1 Project</li>
            <li>✅ Basic Analytics</li>
            <li>✅ Email Support</li>
            <li>🚫 Team Collaboration</li>
          </ul>
          <button className="w-full bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-black rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition transform scale-105">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Pro</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">$19<span className="text-base font-normal">/mo</span></p>
          <ul className="text-sm text-gray-600 mb-6 space-y-2">
            <li>✅ Unlimited Projects</li>
            <li>✅ Advanced Analytics</li>
            <li>✅ Priority Support</li>
            <li>✅ Team Collaboration</li>
          </ul>
          <button className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-900 transition">
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Enterprise</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">Custom</p>
          <ul className="text-sm text-gray-600 mb-6 space-y-2">
            <li>✅ All Pro Features</li>
            <li>✅ Dedicated Account Manager</li>
            <li>✅ SLA & Support Agreement</li>
            <li>✅ Custom Integrations</li>
          </ul>
          <button className="w-full bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-800 transition">
            Contact Sales
          </button>
        </div>
      </div>

      <Footer/>

    </div>
    </div>
  );
};

export default Pricing;
