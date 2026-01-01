// pages/dashboard.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import UploadDashboard from "@/components/uploads/UploadDashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent("/dashboard")}`
      );
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      {/* (Hero section ) */}
      <section className="relative overflow-hidden bg-emerald-950 py-[clamp(4rem,10vw,9rem)]">
        {/* Lazy-loaded Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Ethiopian-Church-Forests.webp')",
          }}
          aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-emerald-950/40" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-12 text-center">
          <div className="space-y-4 sm:space-y-6">
            {/* Welcome Message */}
            <h1 className="font-extrabold tracking-tight text-white">
              <span className="block text-[clamp(1.5rem,5vw,3rem)] sm:text-[clamp(2rem,5vw,4rem)] lg:text-[clamp(3rem,5vw,5rem)]">
                Welcome back,{" "}
                <span className="text-emerald-300">
                  {user.name.split(" ")[0]}
                </span>{" "}
                👋
              </span>
              <span className="block mt-2 text-emerald-300 text-[clamp(2rem,6vw,4rem)] sm:text-[clamp(2.5rem,6vw,5rem)] lg:text-[clamp(3rem,6vw,6rem)]">
                Share Ethiopia&apos;s Sacred Treasures
              </span>
              <span className="block mt-2 text-[clamp(2rem,8vw,4rem)] sm:text-[clamp(3rem,8vw,5rem)] lg:text-[clamp(4rem,8vw,6rem)]">
                🌿
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-full sm:max-w-3xl text-[clamp(0.875rem,3vw,1.25rem)] sm:text-[clamp(1rem,3vw,1.5rem)] lg:text-[clamp(1.125rem,3vw,1.75rem)] text-emerald-100 leading-relaxed">
              Your photos and videos of ancient church forests, hidden trails,
              and cultural moments help travelers discover and protect
              Ethiopia&apos;s natural soul.
            </p>

            {/* Community Line */}
            <p className="mx-auto max-w-full sm:max-w-2xl text-[clamp(0.75rem,2.5vw,1rem)] sm:text-[clamp(0.875rem,2.5vw,1.125rem)] lg:text-[clamp(1rem,2.5vw,1.25rem)] text-emerald-200 font-medium">
              Every upload is carefully reviewed • Join thousands preserving our
              shared heritage
            </p>
          </div>
        </div>

        {/* Scroll Hint - Mobile only */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce sm:hidden">
          <span className="text-white text-3xl">↓</span>
        </div>
      </section>
      {/* DASHBOARD CONTENT */}
      <div className="bg-linear-to-b from-gray-50 to-slate-100 py-8 sm:py-12 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-12">
          {/* Upload Section */}
          <div className="mt-12 sm:mt-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
                Upload Your Discovery
              </h2>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-full sm:max-w-2xl mx-auto">
                Add a photo or video with location and story — we&apos;ll review
                it within 48 hours.
              </p>
            </div>

            <UploadDashboard userId={user.id} />
          </div>

          {/* Guidelines */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-slate-600 text-sm sm:text-base">
              Need help? Read our{" "}
              <Link
                href="/guidelines"
                className="text-emerald-600 hover:text-emerald-700 font-medium">
                Community Guidelines
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
