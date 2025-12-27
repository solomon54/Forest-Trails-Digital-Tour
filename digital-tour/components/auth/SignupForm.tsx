// components/auth/SignupForm.tsx
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import { useRouter } from "next/router";

const SignupForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Field-specific errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeError, setAgreeError] = useState("");

  // Global server/network error
  const [serverError, setServerError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");

  const router = useRouter();
  const redirectTo = (router.query.redirect as string) || "/";

  // Password strength calculator
  const updatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    const strength = score < 3 ? "weak" : score < 5 ? "medium" : "strong";
    setPasswordStrength(strength);
    return strength;
  };

  // Real-time validation helpers
  const validateName = (value: string) => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().split(" ").length < 2)
      return "Please enter your full name";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    const strength = updatePasswordStrength(value);
    if (strength === "weak")
      return "Use uppercase, lowercase, number, and symbol";
    return "";
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const pwdErr = validatePassword(password);
    const agreeErr = agree
      ? ""
      : "You must agree to the Terms and Privacy Policy";

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(pwdErr);
    setAgreeError(agreeErr);

    if (nameErr || emailErr || pwdErr || agreeErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Signup failed — please try again.");
        return;
      }

      alert("Account created successfully! Redirecting to login…");
      router.push(`/Login?redirect=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
      setServerError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Server/Network Error */}
      {serverError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
          role="alert">
          {serverError}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1.5">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(validateName(e.target.value));
          }}
          onBlur={() => setNameError(validateName(name))}
          placeholder="Solomon Tsehay"
          className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 transition-all
            ${
              nameError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            } focus:outline-none focus:ring-2`}
        />
        {nameError && (
          <p className="mt-1.5 text-sm text-red-600">{nameError}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5">
          Email Address
        </label>
        <input
          id="email"
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
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              updatePasswordStrength(e.target.value);
              if (passwordError)
                setPasswordError(validatePassword(e.target.value));
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
            placeholder="At least 8 characters"
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
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700">
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Strength Bar */}
        <div className="mt-3">
          <div className="flex h-2 rounded-full overflow-hidden bg-slate-200">
            <div
              className={`transition-all duration-500 ease-out ${
                passwordStrength === "weak"
                  ? "w-1/3 bg-red-500"
                  : passwordStrength === "medium"
                  ? "w-2/3 bg-amber-500"
                  : "w-full bg-emerald-600"
              }`}
            />
          </div>
          <p
            className={`text-xs mt-1.5 ${
              passwordStrength === "weak"
                ? "text-red-600"
                : passwordStrength === "medium"
                ? "text-amber-600"
                : "text-emerald-600"
            } font-medium`}>
            Password strength:{" "}
            <span className="capitalize">{passwordStrength}</span>
          </p>
        </div>
        {passwordError && (
          <p className="mt-1.5 text-sm text-red-600">{passwordError}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="agree"
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            if (agreeError) setAgreeError("");
          }}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
        />
        <label
          htmlFor="agree"
          className="text-sm text-slate-700 leading-relaxed">
          I agree to the{" "}
          <a
            href="/terms"
            className="font-medium text-emerald-600 hover:text-emerald-700 underline-offset-2 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="font-medium text-emerald-600 hover:text-emerald-700 underline-offset-2 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {agreeError && (
        <p className="text-sm text-red-600 -mt-3 mb-2">{agreeError}</p>
      )}

      {/* Submit Button */}
      <Button
        buttonLabel={loading ? "Creating Account..." : "Create Account"}
        buttonBackgroundColor="emerald"
        type="submit"
        disabled={loading || passwordStrength === "weak"}
        className="w-full py-3.5 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-70"
      />

      {/* Login Link */}
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={`/Login?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-emerald-600 hover:text-emerald-700 underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
