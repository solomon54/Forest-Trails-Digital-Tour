// components/landing/AboutSection.tsx
export default function AboutSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content — Mobile-First */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Heading — Fluid & Balanced */}
            <h2 className="font-extrabold text-slate-900 leading-tight">
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Preserving Ethiopia&apos;s
              </span>
              <span className="block text-emerald-600 mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Living Heritage
              </span>
            </h2>

            {/* Body Text — Readable & Spacious */}
            <div className="space-y-6 text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed">
              <p>
                For centuries, Ethiopia&apos;s ancient church forests have been
                sacred oases — protected islands of biodiversity surrounded by
                human landscapes. These green sanctuaries are not just nature
                reserves; they are living spiritual centers, home to rare
                wildlife, ancient trees, and centuries-old traditions.
              </p>
              <p>
                Forest·Trails was born from a simple belief:{" "}
                <strong className="text-emerald-700">
                  responsible exploration can help protect what we love
                </strong>
                .
              </p>
              <p>
                Every tour you take, every photo you share, and every story you
                tell supports local communities and helps preserve these
                irreplaceable places for future generations.
              </p>
            </div>

            {/* Closing Line */}
            <div className="pt-6">
              <p className="text-emerald-700 font-semibold text-lg sm:text-xl lg:text-2xl">
                Together, we walk lightly — and leave a lasting legacy.
              </p>
            </div>
          </div>

          {/* Image — Responsive & Elegant */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto">
              <img
                src="/images/zege.webp"
                alt="Local community in an Ethiopian church forest"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-2xl sm:text-3xl font-bold drop-shadow-md">
                  Sacred Forests
                </p>
                <p className="text-lg sm:text-xl opacity-90 drop-shadow-md">
                  Guardians of faith and nature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
