// components/landing/HowItWorks.tsx
import {
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to begin your sacred journey
          </p>
        </div>

        {/* Steps — Subtle & Elegant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Step 1 */}
          <div className="relative group">
            <div className="flex flex-col items-center text-center">
              {/* Icon — Subtle Circle */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors duration-300">
                <MapPinIcon className="h-8 w-8 text-emerald-700" />
              </div>

              {/* Content */}
              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
                Choose Your Trail
              </h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xs">
                Explore hand-curated journeys through ancient church forests and
                sacred sites
              </p>
            </div>

            {/* Subtle Connector Line (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-emerald-200 to-transparent opacity-50" />
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors duration-300">
                <CalendarIcon className="h-8 w-8 text-emerald-700" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
                Book Securely
              </h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xs">
                Reserve your spot with confidence — transparent, easy, and safe
              </p>
            </div>

            <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-emerald-200 to-transparent opacity-50" />
          </div>

          {/* Step 3 */}
          <div className="group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors duration-300">
                <HeartIcon className="h-8 w-8 text-emerald-700" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
                Experience & Preserve
              </h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xs">
                Travel responsibly and help protect Ethiopia&apos;s sacred
                heritage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
