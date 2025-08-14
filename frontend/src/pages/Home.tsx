import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { userAuthStore } from "../../store/userAuthStore";

export default function HomePage() {
  const { isCheckingAuth, isDarkMode } = userAuthStore();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
      }`}>
        <div className={`animate-spin rounded-full h-32 w-32 border-b-2 ${
          isDarkMode ? "border-[#3B82F6]" : "border-[#3B82F6]"
        }`}></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* <CTASection /> */}
      <FAQSection />
      <Footer />
    </>
  );
}
