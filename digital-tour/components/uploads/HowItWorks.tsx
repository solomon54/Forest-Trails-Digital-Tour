// components/uploads/HowItWorks.tsx
import {
  CameraIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: CameraIcon,
    title: "1. You Capture",
    description:
      "Take a photo or video of Ethiopia's sacred church forests, hidden trails, or cultural moments during your journey.",
  },
  {
    icon: ShieldCheckIcon,
    title: "2. We Review",
    description:
      "Our team carefully verifies authenticity, quality, and respect for local culture before publishing.",
  },
  {
    icon: GlobeAltIcon,
    title: "3. World Discovers",
    description:
      "Travelers from around the globe find and help protect these sacred places — thanks to you.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <h2
          className="
            text-center font-bold text-slate-900
            text-[clamp(1.5rem,6vw,3rem)]
            mb-10 sm:mb-14
          ">
          How Your Contribution Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="
                  group h-full bg-white rounded-3xl
                  border border-emerald-100
                  p-6 sm:p-8 lg:p-10
                  text-center
                  transition
                  hover:shadow-xl
                ">
                {/* Icon */}
                <div
                  className="
                    mx-auto mb-5 sm:mb-6
                    flex h-16 w-16 sm:h-20 sm:w-20
                    items-center justify-center
                    rounded-full
                    bg-emerald-100
                    transition-colors
                    group-hover:bg-emerald-200
                  ">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-700" />
                </div>

                {/* Title */}
                <h3
                  className="
                    mb-3 font-semibold text-emerald-700
                    text-[clamp(1.125rem,4vw,1.5rem)]
                  ">
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-slate-600
                    text-[clamp(0.875rem,3.5vw,1.125rem)]
                    leading-relaxed
                  ">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer line */}
        <div className="mt-10 sm:mt-14 text-center">
          <p
            className="
              text-slate-500
              text-[clamp(0.75rem,3vw,1rem)]
            ">
            Every approved photo helps preserve Ethiopia&apos;s natural and
            cultural heritage 🌍
          </p>
        </div>
      </div>
    </section>
  );
}
