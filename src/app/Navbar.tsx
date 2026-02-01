"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Početna" },
    { href: "/events", label: "Događaji" },
    { href: "/profile", label: "Profil" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" absolute top-0 left-0 right-0 z-50 h-25 backdrop-blur-xs border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center h-full">
        <div className="flex justify-between items-center h-full">
          <div className="shrink-0 mr-12">
            <Link href="/" className="text-2xl font-bold">
              <Image
                src="/logo-beli-pubquiz.png"
                alt="PubQuiz Logo"
                width={75}
                height={75}
                className="hover:scale-105 transition-transform hover:brightness-110 duration-500"
              />
            </Link>
          </div>
          <ul className="hidden md:flex space-x-15 text-md">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block text-white font-semibold hover:text-pub-beige hover:scale-110 transition-transform duration-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md cursor-pointer hover:scale-105 transition"
            >
              <svg
                className={`h-6 w-6 transition ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-transparent">
          <ul className="px-2 pt-2 pb-3 space-y-1 text-lg">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 border-gray-700 border-b-2  hover:bg-slate-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
