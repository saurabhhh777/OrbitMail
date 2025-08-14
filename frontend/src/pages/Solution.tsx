import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { userAuthStore } from "../../store/userAuthStore";

const Solution = () => {
  const { isDarkMode } = userAuthStore();
  return (
    <>
      <Navbar />
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      }`}>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className={`text-4xl font-bold mb-4 font-poppins ${
            isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
          }`}>
            Our Complete Solution
          </h1>
          <p className={`text-lg max-w-2xl mx-auto font-jost ${
            isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
          }`}>
            Discover how our platform helps you streamline your workflow, enhance productivity, and scale effortlessly.
          </p>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-20">
          <div className={`rounded-xl p-6 shadow hover:shadow-md transition-colors duration-200 border ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] shadow-[#0A0A0A]/20" 
              : "bg-[#FFFFFF] border-[#E5E5E5] shadow-[#0A0A0A]/10"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Automation</h3>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Automate repetitive tasks with ease and focus on what matters most. Our tools do the heavy lifting.
            </p>
          </div>
          <div className={`rounded-xl p-6 shadow hover:shadow-md transition-colors duration-200 border ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] shadow-[#0A0A0A]/20" 
              : "bg-[#FFFFFF] border-[#E5E5E5] shadow-[#0A0A0A]/10"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Analytics</h3>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Gain real-time insights into your operations with powerful dashboards and reporting tools.
            </p>
          </div>
          <div className={`rounded-xl p-6 shadow hover:shadow-md transition-colors duration-200 border ${
            isDarkMode 
              ? "bg-[#171717] border-[#262626] shadow-[#0A0A0A]/20" 
              : "bg-[#FFFFFF] border-[#E5E5E5] shadow-[#0A0A0A]/10"
          }`}>
            <h3 className={`text-xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Integration</h3>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
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
