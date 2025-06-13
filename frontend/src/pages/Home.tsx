import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import CTASection from "../components/CtaSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturesSection />
      {/* <CTASection /> */}
      <FAQSection />
      <Footer />
    </>
  );
}
