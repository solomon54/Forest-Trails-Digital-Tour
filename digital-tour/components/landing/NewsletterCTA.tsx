// components/landing/NewsletterCTA.tsx
import { useState, useEffect } from "react";
import Button from "@/components/buttons/Button";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you! You’ve joined the trail.");
      setEmail(""); // Clear input
    }, 1200);
  };

  // Auto-clear success message after 4 seconds
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000); // 4 seconds — perfect balance

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Clear error on input change
  useEffect(() => {
    if (status === "error" && email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      setMessage("");
    }
  }, [email, status]);

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-emerald-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Be the First to Know
        </h2>
        <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get exclusive access to new sacred trails, cultural experiences, and
          preservation updates from Ethiopia&apos;s hidden forests.
        </p>

        <form onSubmit={handleSubmit} noValidate className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`
                  w-full px-6 py-4 rounded-full text-lg 
                  bg-slate-300 backdrop-blur-sm 
                  text-slate-900 
                  placeholder-slate-500 
                  border-2 border-white/30
                  focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30
                  transition-all duration-300
                  ${
                    status === "error"
                      ? "border-red-400 ring-4 ring-red-400/30"
                      : ""
                  }
                `}
                disabled={status === "loading"}
              />

              {status === "error" && (
                <ExclamationCircleIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500 pointer-events-none" />
              )}
            </div>

            <Button
              type="submit"
              variant="solid"
              size="lg"
              loading={status === "loading"}
              disabled={status === "loading"}
              className="bg-teal-700 text-emerald-900 hover:bg-teal-600 shadow-lg hover:shadow-xl">
              Subscribe
            </Button>
          </div>

          {/* Feedback Messages with Smooth Transition */}
          <div className="mt-5 min-h-7 overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out ${
                status === "success" || status === "error"
                  ? "opacity-100"
                  : "opacity-0"
              }`}>
              {status === "error" && (
                <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {message}
                </p>
              )}
              {status === "success" && (
                <p className="text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  {message}
                </p>
              )}
            </div>
          </div>
        </form>

        <p className="mt-8 text-emerald-200 text-sm">
          No spam • Unsubscribe anytime • We respect your privacy
        </p>
      </div>
    </section>
  );
}
