// components/landing/Hero.tsx
import Link from "next/link";
import Button from "@/components/buttons/Button";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 text-center pt-20 pb-32 sm:pb-40">
        {/* Headline */}
        <h1 className="font-extrabold text-white mb-8 leading-tight">
          <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Ethiopia&apos;s
          </span>
          <span className="block text-emerald-300 mt-3 sm:mt-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
            Sacred Hidden Trails
          </span>
          <span className="block mt-4 sm:mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            🌿
          </span>
        </h1>

        {/* Subtitle — Fixed: Better padding on mobile */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed px-6 sm:px-8 lg:px-0">
          Curated journeys through ancient church forests, untouched mountains,
          and living cultural heritage — where nature and spirit meet.
        </p>

        {/* Buttons — Already Perfect */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <Link href="/tours">
            <Button
              variant="solid"
              intent="emerald"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition">
              Explore Tours
            </Button>
          </Link>

          <Link href="/Signup">
            <Button
              variant="outline"
              intent="emerald"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg sm:text-xl font-bold rounded-full border-4 border-white hover:bg-white hover:text-emerald-900 transition">
              Join the Trail
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Hint — Perfect */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <div className="animate-bounce">
          <span className="text-white text-2xl drop-shadow-lg">↓</span>
        </div>
      </div>
    </section>
  );
}
