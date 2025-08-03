import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { userAuthStore } from "../../store/userAuthStore";

export default function HomePage() {
  const { isCheckingAuth } = userAuthStore();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
