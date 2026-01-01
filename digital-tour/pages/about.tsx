// pages/about.tsx
import { useState } from "react";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function AboutPage() {
  // All hooks inside the component
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: name.trim() ? "" : "Name is required",
      email:
        email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? ""
          : "Valid email is required",
      message: message.trim() ? "" : "Message is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => setStatus("idle"), 5000);
    }, 1200);
  };

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{
            backgroundImage: "url('/images/Ethiopian-Church-Forests.webp')",
          }}>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-emerald-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
            Preserving Ethiopia&apos;s
            <span className="block text-emerald-300 mt-4">Sacred Soul</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            One trail, one story, one forest at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-8">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
            Forest·Trails was born from a deep love for Ethiopia&apos;s ancient
            church forests — living sanctuaries where faith, nature, and culture
            have coexisted for centuries.
          </p>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mt-6 max-w-3xl mx-auto">
            These sacred places are disappearing. Through responsible
            exploration and community storytelling, we aim to protect them — not
            just as destinations, but as living heritage.
          </p>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mt-6 max-w-3xl mx-auto">
            Every journey shared here supports local guides, raises awareness,
            and helps preserve what makes Ethiopia&apos;s highlands truly
            sacred.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 sm:py-28 bg-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/Founder.webp"
                  alt="Solomon Tsehay, Founder of Forest·Trails"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900">
                Meet the Founder
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                Hi, I&apos;m <strong>Solomon Tsehay</strong> — a passionate
                explorer, storyteller, and guardian of Ethiopia&apos;s natural
                heritage.
              </p>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                Growing up surrounded by these sacred forests, I witnessed their
                quiet magic — and their quiet disappearance. Forest·Trails is my
                way of inviting the world to fall in love with them, just as I
                did.
              </p>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                This isn&apos;t just a travel platform. It&apos;s a movement to
                protect what cannot speak for itself.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="mailto:hello@foresttrails.et">
                  <Button variant="solid" intent="emerald" size="lg">
                    Get in Touch
                  </Button>
                </Link>
                <Link
                  href="https://linkedin.com/in/solomon-tsehay"
                  target="_blank">
                  <Button variant="outline" intent="emerald" size="lg">
                    LinkedIn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form — Now Fully Working */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Let&apos;s Connect
            </h2>
            <p className="text-xl text-slate-600">
              Have a question? Want to collaborate? Or just say hello?
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-emerald-100 space-y-7">
            {/* Name */}
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="Your Name"
                className={`
                  w-full px-6 py-4 rounded-xl border-2 text-lg transition-all duration-300
                  ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
                  }
                  text-slate-900 placeholder-slate-600
                `}
              />
              {errors.name && (
                <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="your@email.com"
                className={`
                  w-full px-6 py-4 rounded-xl border-2 text-lg transition-all duration-300
                  ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
                  }
                  text-slate-900 placeholder-slate-600
                `}
              />
              {errors.email && (
                <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                placeholder="Your Message..."
                rows={6}
                className={`
                  w-full px-6 py-4 rounded-xl border-2 text-lg leading-relaxed resize-none transition-all duration-300
                  ${
                    errors.message
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
                  }
                  text-slate-900 placeholder-slate-600
                `}
              />
              {errors.message && (
                <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {errors.message}
                </p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                variant="solid"
                intent="emerald"
                size="xl"
                loading={status === "loading"}
                disabled={status === "loading"}
                className="w-full py-5 text-xl font-bold rounded-xl shadow-xl hover:shadow-emerald-500/50">
                Send Message
              </Button>

              <div className="mt-5 min-h-[2rem]">
                {status === "success" && (
                  <p className="text-emerald-700 text-center font-medium flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-6 w-6" />
                    Message sent! I&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-600 text-center font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </div>
          </form>

          <p className="text-center mt-10 text-slate-700">
            Or email directly:{" "}
            <a
              href="mailto:hello@foresttrails.et"
              className="text-emerald-600 font-semibold hover:text-emerald-700 underline-offset-4 hover:underline transition">
              hello@foresttrails.et
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
