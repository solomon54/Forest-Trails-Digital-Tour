// components/landing/StatsSection.tsx
import { motion } from "framer-motion";

const stats = [
  {
    number: "12+",
    label: "Sacred Forests",
    description: "Featured & protected on our platform",
  },
  {
    number: "5,000+",
    label: "Contributions",
    description: "Photos & stories from explorers",
  },
  {
    number: "48",
    label: "Hour Review",
    description: "Every upload carefully verified",
  },
  {
    number: "100%",
    label: "Community Focus",
    description: "Supporting preservation & guides",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-emerald-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Growing Impact
          </h2>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Together, we&apos;re preserving Ethiopia&apos;s sacred natural and
            cultural heritage
          </p>
        </div>

        {/* Stats Grid — Equal Height Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: "easeOut",
              }}
              className="flex">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:border-white/50 transition-all duration-500 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center">
                {/* Number */}
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-300 mb-2 sm:mb-3">
                  {stat.number}
                </p>

                {/* Label */}
                <p className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm lg:text-base text-emerald-100 leading-snug px-2">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
