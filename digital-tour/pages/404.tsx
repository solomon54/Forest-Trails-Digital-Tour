// pages/404.tsx
import Link from "next/link";
import Button from "@/components/buttons/Button";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-emerald-950">
      {/* Immersive Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: "url('/images/Ethiopian-Church-Forests.webp')",
        }}>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-emerald-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* 404 + Message */}
        <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-extrabold text-emerald-300 mb-6 tracking-tighter">
          404
        </h1>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Oops! This trail got a little too hidden...
        </h2>

        <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist — even the best
          explorers sometimes lose the path.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Go Home */}
          <Link href="/">
            <Button
              variant="solid"
              intent="emerald"
              size="xl"
              className="px-10 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition">
              Return Home
            </Button>
          </Link>

          {/* Go Back */}
          <Button
            variant="outline"
            intent="emerald"
            size="xl"
            onClick={() => router.back()}
            className="px-10 py-5 text-xl font-bold rounded-full border-4 border-white hover:bg-white hover:text-emerald-900 transition">
            Go Back
          </Button>
        </div>

        {/* Subtle Footer Note */}
        <p className="mt-16 text-emerald-200 text-sm sm:text-base">
          Still lost?{" "}
          <Link
            href="/contact"
            className="underline hover:text-white transition">
            Contact us
          </Link>{" "}
          — we&apos;ll help you find the way.
        </p>
      </div>
    </div>
  );
}
