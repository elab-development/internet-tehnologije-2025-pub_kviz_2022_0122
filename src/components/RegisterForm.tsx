"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registracija neuspešna");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Došlo je do greške");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pub-beige">
      <div className="w-full max-w-md rounded-lg border-2 border-pub-orange bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-black">
          Registracija
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black mb-2"
            >
              Ime
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
              placeholder="Unesite vaše ime"
            />
          </div>

          <div>
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
              className="w-full rounded-lg border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
              placeholder="Unesite vaš email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-2"
            >
              Lozinka
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
              placeholder="Unesite vašu lozinku"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-100 border border-red-400 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border-2 border-pub-orange bg-pub-orange px-4 py-3 text-lg font-semibold text-white transition duration-500 hover:bg-pub-beige hover:text-pub-orange disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registracija..." : "Registruj se"}
          </button>
        </form>

        <p className="text-center mt-4 text-black">
          Već imaš nalog?{" "}
          <a href="/login" className="text-pub-orange hover:underline font-semibold">
            Prijavi se
          </a>
        </p>
      </div>
    </div>
  );
}
