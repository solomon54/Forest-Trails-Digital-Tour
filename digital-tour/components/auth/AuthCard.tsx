// components/auth/AuthCard.tsx
import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  heading?: string;
  subheading?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, heading, subheading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/signup-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <main
        role="main"
        className="relative z-10 w-full max-w-xl mx-4 sm:mx-6 md:mx-auto p-6 md:p-10 rounded-3xl bg-white/95 shadow-2xl"
        aria-labelledby="auth-heading"
      >
        <header className="mb-6 text-center">
          {heading && (
            <h1 id="auth-heading" className="text-2xl md:text-3xl font-semibold text-slate-900">
              {heading}
            </h1>
          )}
          {subheading && <p className="mt-2 text-slate-600">{subheading}</p>}
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
};

export default AuthCard;
