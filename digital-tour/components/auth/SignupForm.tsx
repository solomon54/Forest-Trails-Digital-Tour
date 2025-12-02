// components/auth/SignupForm.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/buttons/Button";
import Link from "next/link";

const SignupForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("weak");

  const updatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    setPasswordStrength(score < 3 ? "weak" : score < 5 ? "medium" : "strong");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all required fields.");
      return;
    }
    if (!agree) {
      setError("You must agree to the terms to sign up.");
      return;
    }
    if (passwordStrength === "weak") {
      setError("Password too weak—use 8+ chars with upper, lower, number, symbol.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed—please try again.");
        return;
      }

      alert("Account created successfully! Redirecting to login…");
      window.location.href = "/Login";
    } catch (err) {
      setError("Network error—please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Solomon Tsehay"
          className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              updatePasswordStrength(e.target.value);
            }}
            placeholder="At least 8 characters"
            minLength={8}
            className="appearance-none rounded-md block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        {/* Password Strength */}
        <div className="mt-2">
          <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
            <div
              className={`transition-all duration-300 ${
                passwordStrength === "weak" ? "w-1/3 bg-red-500" :
                passwordStrength === "medium" ? "w-2/3 bg-amber-500" :
                "w-full bg-emerald-600"
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">Password strength: {passwordStrength}</p>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center">
        <input
          id="agree"
          name="agree"
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="agree" className="ml-2 block text-sm text-gray-900">
          Agree to our{' '}
          <a href="/terms" className="text-emerald-600 hover:text-emerald-500">Terms</a> and{' '}
          <a href="/privacy" className="text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
        </label>
      </div>

      {/* Submit */}
      <Button
        buttonLabel={loading ? "Creating..." : "Create Account"}
        buttonBackgroundColor="emerald"
        type="submit"
        disabled={loading || passwordStrength === "weak"}
        className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
      />

      <div className="text-center">
        <Link href="/Login" className="text-sm text-emerald-600 hover:text-emerald-500">
          Already have an account? Log in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
