// components/landing/FeaturedTours.tsx
import PropertyCard from "@/components/property/PropertyCard";

const featuredTours = [
  {
    id: 1,
    name: "Simien Mountains Trek",
    location: "Gondar Region",
    price: 180,
    image: "/images/hero.jpg",
  },
  {
    id: 2,
    name: "Lake Tana & Blue Nile Falls",
    location: "Bahir Dar",
    price: 150,
    image: "/images/login-bg.jpg",
  },
  {
    id: 3,
    name: "Ancient Church Forests of Zege",
    location: "Lake Tana Peninsula",
    price: 120,
    image: "/images/images.jpeg",
  },
];

export default function FeaturedTours() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Featured Journeys
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Handpicked adventures into Ethiopia&apos;s most sacred and untouched
            natural wonders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredTours.map((tour) => (
            <PropertyCard
              key={tour.id}
              name={tour.name}
              location={tour.location}
              price={tour.price}
              image={tour.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
