// components/hero/HeroSection.tsx
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

const HeroSection = ({
  title,
  subtitle,
  backgroundImage ,
  ctaPrimary,
  ctaSecondary,
}: HeroSectionProps) => {

  return (
    <section
    
      className="relative w-full h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`  }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-16 text-white max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-inter">
          {title}
        </h1>
        <p className="text-lg md:text-2xl mb-8 font-medium">{subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={ctaPrimary.href}>
            <button className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-medium">
              {ctaPrimary.label}
            </button>
          </Link>

          {ctaSecondary && (
            <Link href={ctaSecondary.href}>
              <button className="px-8 py-3 rounded-xl border border-white hover:bg-white hover:text-black transition font-medium">
                {ctaSecondary.label}
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
