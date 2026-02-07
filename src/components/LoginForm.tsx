"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <img
        src="/images/login/pub-login.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="fixed inset-0 bg-black/30 -z-10 backdrop-blur-xs"></div>

      <div className="relative z-10 w-full max-w-md border-2 border-pub-orange bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-black">
          Prijavite se
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
              placeholder="Enter your email"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="bg-red-100 border w-full border-red-400 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          <Button
            onClick={handleSubmit}
            label={loading ? "Logging in..." : "Login"}
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}
