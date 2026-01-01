// components/landing/Testimonials.tsx
import { StarIcon } from "@heroicons/react/20/solid";

// Helper: Generate initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "bg-emerald-600",
  "bg-emerald-500",
  "bg-teal-600",
  "bg-green-600",
  "bg-emerald-700",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Travel Photographer, USA",
    content:
      "The church forests of Zege were unlike anything I've seen. Walking through ancient trees surrounding 500-year-old monasteries felt like stepping into a living prayer. Forest·Trails made it possible with respect and care.",
    rating: 5,
    avatar: null,
  },
  {
    name: "Dawit Kebede",
    role: "Local Guide, Gondar",
    content:
      "I grew up near these forests. Seeing travelers come with such reverence, learning our traditions — it gives me hope for preservation. This platform helps my community directly.",
    rating: 5,
    avatar: null,
  },
  {
    name: "Elena Müller",
    role: "Conservation Student, Germany",
    content:
      "The biodiversity in these small forests is incredible — rare birds, endemic plants, all protected by faith. Forest·Trails combines adventure with real conservation impact.",
    rating: 5,
    avatar: null,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Voices from the Trail
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            What explorers and locals say about their Forest·Trails experiences
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                {/* Avatar + Name/Role — Adaptive Layout */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-emerald-200 shadow-md"
                      />
                    ) : (
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl border-4 border-white shadow-lg ${
                          avatarColors[i % avatarColors.length]
                        }`}>
                        {getInitials(t.name)}
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-slate-900 text-base sm:text-lg lg:text-xl">
                      {t.name}
                    </p>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                      {t.role}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center sm:justify-start mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base lg:text-lg flex-1">
                  &quot;{t.content}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
