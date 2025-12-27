// components/auth/LoginForm.tsx   ← REVERTED TO SIMPLE REDIRECT (no forced admin redirect)
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        return;
      }

      // Simple redirect — all users go to the intended page (usually home)
      router.replace(redirectTo);
    } catch (err) {
      setError("Network error—please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-4 rounded-ss-full bg-gray-300/70 p-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", color: "#333", outline: "none" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="you@domain.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <div className="relative">
            <input
              style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", color: "#333", outline: "none" }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md pr-10"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          buttonLabel={loading ? "Logging in..." : "Login"}
          buttonBackgroundColor="emerald"
          disabled={loading}
          className="w-full"
        />

        <p className="text-sm text-center mt-2">
          <Link 
          href={`/Signup?redirect=${encodeURIComponent(redirectTo)}`} 
          className="text-emerald-600"
        >
          Don&apos;t have an account? Sign up
        </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
