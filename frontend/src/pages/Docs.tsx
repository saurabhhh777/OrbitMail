import Navbar from "../components/Navbar";
import { userAuthStore } from "../../store/userAuthStore";

const Docs = () => {
  const { isDarkMode } = userAuthStore();
  return (
    <>
      <Navbar />
      <div className={`flex min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      }`}>
        {/* Sidebar */}
        <aside className={`w-64 shadow-md hidden md:block border-r transition-colors duration-200 ${
          isDarkMode 
            ? "bg-[#171717] border-[#262626] text-[#FAFAFA]" 
            : "bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A]"
        }`}>
          <div className={`p-6 border-b ${
            isDarkMode ? "border-[#262626]" : "border-[#E5E5E5]"
          }`}>
            <h2 className={`text-xl font-semibold font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Documentation</h2>
          </div>
          <nav className={`p-4 text-sm space-y-2 ${
            isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
          }`}>
            <a href="#getting-started" className={`block hover:underline transition-colors font-jost ${
              isDarkMode ? "hover:text-[#FAFAFA]" : "hover:text-[#0A0A0A]"
            }`}>Getting Started</a>
            <a href="#installation" className={`block hover:underline transition-colors font-jost ${
              isDarkMode ? "hover:text-[#FAFAFA]" : "hover:text-[#0A0A0A]"
            }`}>Installation</a>
            <a href="#api" className={`block hover:underline transition-colors font-jost ${
              isDarkMode ? "hover:text-[#FAFAFA]" : "hover:text-[#0A0A0A]"
            }`}>API Reference</a>
            <a href="#examples" className={`block hover:underline transition-colors font-jost ${
              isDarkMode ? "hover:text-[#FAFAFA]" : "hover:text-[#0A0A0A]"
            }`}>Examples</a>
            <a href="#faq" className={`block hover:underline transition-colors font-jost ${
              isDarkMode ? "hover:text-[#FAFAFA]" : "hover:text-[#0A0A0A]"
            }`}>FAQ</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          <section id="getting-started" className="mb-10">
            <h2 className={`text-2xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Getting Started</h2>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>
              Welcome to the documentation. This guide will help you set up and use our platform efficiently.
            </p>
          </section>

          <section id="installation" className="mb-10">
            <h2 className={`text-2xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Installation</h2>
            <pre className={`p-4 rounded text-sm overflow-x-auto border transition-colors ${
              isDarkMode 
                ? "bg-[#262626] border-[#404040] text-[#FAFAFA]" 
                : "bg-[#F5F5F5] border-[#E5E5E5] text-[#0A0A0A]"
            }`}>
              <code>npm install your-library-name</code>
            </pre>
          </section>

          <section id="api" className="mb-10">
            <h2 className={`text-2xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>API Reference</h2>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>Detailed documentation of all available functions and endpoints.</p>
          </section>

          <section id="examples" className="mb-10">
            <h2 className={`text-2xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>Examples</h2>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>See real usage examples to understand how it works in practice.</p>
          </section>

          <section id="faq">
            <h2 className={`text-2xl font-semibold mb-2 font-poppins ${
              isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
            }`}>FAQ</h2>
            <p className={`text-sm font-jost ${
              isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
            }`}>Find answers to common questions about the platform.</p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Docs;
