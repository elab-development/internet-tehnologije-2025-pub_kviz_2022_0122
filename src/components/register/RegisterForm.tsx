"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { getRegisterFields } from "@/constants/formFields";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fields = getRegisterFields(
    { name, email, password },
    { setName, setEmail, setPassword },
  );
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
      window.location.href = "/login";
    } catch (err) {
      setError("Došlo je do greške");
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
      <div className="w-full max-w-md border-2 border-pub-orange bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-black">
          Registracija
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-col items-center"
        >
          {fields.map((field) => (
            <div key={field.id} className="w-full">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-black mb-2"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                required
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full border-2 border-pub-orange bg-pub-beige px-4 py-3 text-black placeholder-pub-gray focus:border-pub-blue focus:outline-none focus:ring-2 focus:ring-pub-blue transition"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-100 border border-red-400 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            label={loading ? "Registracija..." : "Registruj se"}
            disabled={loading}
          />
        </form>

        <p className="text-center mt-4 text-black">
          Već imaš nalog?{" "}
          <a
            href="/login"
            className="text-pub-orange hover:underline font-semibold"
          >
            Prijavi se
          </a>
        </p>
      </div>
    </div>
  );
}
