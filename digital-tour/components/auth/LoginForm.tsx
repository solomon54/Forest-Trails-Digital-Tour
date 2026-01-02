// components/auth/LoginForm.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const redirectTo = (router.query.redirect as string) || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Validation helpers
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const emailErr = validateEmail(email);
    const pwdErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(pwdErr);

    if (emailErr || pwdErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Successful login — redirect to intended page
      router.replace(redirectTo);
    } catch (err) {
      setServerError(
        "Network error — please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Server Error */}
      {serverError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
          role="alert">
          {serverError}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-slate-700 mb-1.5">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          onBlur={() => setEmailError(validateEmail(email))}
          placeholder="you@domain.com"
          className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 transition-all
            ${
              emailError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            } focus:outline-none focus:ring-2`}
        />
        {emailError && (
          <p className="mt-1.5 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError)
                setPasswordError(validatePassword(e.target.value));
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
            placeholder="Enter your password"
            className={`w-full px-4 py-3 pr-12 rounded-xl border text-slate-900 placeholder-slate-400 transition-all
              ${
                passwordError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              } focus:outline-none focus:ring-2`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700 transition">
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="mt-1.5 text-sm text-red-600">{passwordError}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="solid"
        intent="emerald"
        size="xl"
        loading={loading}
        disabled={loading}
        className="w-full py-4 text-xl font-bold rounded-xl shadow-xl hover:shadow-emerald-500/50 transition">
        {loading ? "Logging in..." : "Log In"}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-slate-600">
        New to Forest <span className="text-emerald-400">•</span>Trails?{" "}
        <Link
          href={`/Signup?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-emerald-600 hover:text-emerald-700 underline-offset-2 hover:underline transition">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
