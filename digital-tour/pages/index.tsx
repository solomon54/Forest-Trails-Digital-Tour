// pages/index.tsx
import type { NextPage } from "next";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import PropertyCard from "@/components/property/PropertyCard";
import BookingCard from "@/components/property/BookingSection";
import Footer from "@/components/layout/Footer";
import Button from "@/components/buttons/Button";
import CardSkeleton from "@/components/skelotons/CardSkeleton";

// Sample data placeholders
const featuredTours = [
  { id: 1, name: "Ethiopia Adventure", location: "Addis Ababa", price: 120, image: "/images/tour1.jpg" },
  { id: 2, name: "Bahir Dar Lakeside", location: "Bahir Dar", price: 150, image: "/images/tour2.jpg" },
  { id: 3, name: "Simien Mountains Trek", location: "Gondar", price: 180, image: "/images/tour3.jpg" },
];

const LandingPage: NextPage = () => {
  return (
    <div className="bg-neutral-50 text-slate-900 font-inter">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        title="Discover Ethiopia’s Hidden Trails"
        subtitle="Premium travel experiences tailored for adventurers."
        backgroundImage="/images/hero.jpg"
        ctaPrimary={{ label: "Explore Tours", href: "/tours" }}
        ctaSecondary={{ label: "Book Now", href: "/Signup" }}
      />

      {/* Featured Tours */}
      <section className="py-16 px-4 md:px-16">
        <h2 className="text-3xl font-semibold mb-8 text-slate-900">Featured Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTours.length ? (
            featuredTours.map((tour) => (
              <PropertyCard
                key={tour.id}
                name={tour.name}
                location={tour.location}
                price={tour.price}
                image={tour.image}
              />
            ))
          ) : (
            // Skeleton fallback
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 md:px-16 bg-white rounded-2xl shadow-md my-16 mx-4 md:mx-16">
        <h2 className="text-3xl font-semibold mb-8 text-slate-900 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-2">Choose Your Tour</h3>
            <p className="text-slate-600">Pick your preferred adventure from our curated tours.</p>
          </div>
          <div className="p-6 border rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-2">Book Effortlessly</h3>
            <p className="text-slate-600">Secure your spot in just a few clicks using our system.</p>
          </div>
          <div className="p-6 border rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-2">Enjoy the Journey</h3>
            <p className="text-slate-600">Experience unforgettable trips with full guidance and support.</p>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="py-16 px-4 md:px-16 bg-emerald-600 text-white rounded-2xl my-16 mx-4 md:mx-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Stay Updated on New Tours</h2>
          <p className="mb-8 text-slate-100">Subscribe to our newsletter for exclusive adventures.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-6 py-3 rounded-xl w-full sm:w-auto flex-1 text-slate-900"
            />
            <Button buttonLabel="Subscribe" buttonBackgroundColor="amber" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
