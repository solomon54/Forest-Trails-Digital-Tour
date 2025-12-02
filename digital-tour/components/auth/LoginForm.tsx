import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/buttons/Button";
import Link from "next/link";

const LoginForm: React.FC = () => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token or session here if using JWT
      alert("Login successful!");
      window.location.href = "/"; // redirect to home
    } catch (err) {
      setError("Network error—please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md pr-10"
              placeholder="Password"
              required
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <Button type="submit" buttonLabel={loading ? "Logging in..." : "Login"} buttonBackgroundColor="emerald" disabled={loading} className="w-full" />
        <p className="text-sm text-center mt-2">
          Dont have an account? <Link href="/Signup" className="text-emerald-600">Did not have account? Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
