import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
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
