import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Solution = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Complete Solution
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover how our platform helps you streamline your workflow, enhance productivity, and scale effortlessly.
          </p>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-20">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Automation</h3>
            <p className="text-gray-600 text-sm">
              Automate repetitive tasks with ease and focus on what matters most. Our tools do the heavy lifting.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">
              Gain real-time insights into your operations with powerful dashboards and reporting tools.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Integration</h3>
            <p className="text-gray-600 text-sm">
              Seamlessly integrate with your existing systems to ensure a smooth and connected experience.
            </p>
          </div>
        </section>
        <Footer/>
      </div>
    </>
  );
};

export default Solution;
