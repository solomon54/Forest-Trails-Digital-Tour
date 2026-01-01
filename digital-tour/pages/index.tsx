// pages/index.tsx
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/landing/HeroSection";
import FeaturedTours from "@/components/landing/FeaturedTours";
import HowItWorks from "@/components/landing/HowItWorks";
import NewsletterCTA from "@/components/landing/NewsletterCTA";
import AboutSection from "@/components/landing/AboutSection";
import Testimonials from "@/components/landing/Testimonials";
import StatsSection from "@/components/landing/StatsSection";

export default function LandingPage() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <LandingHero />
      <FeaturedTours />
      <HowItWorks />
      <AboutSection />
      <Testimonials />
      <StatsSection />
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
