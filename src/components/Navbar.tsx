"use client";

import Link from "next/link";
import { useState } from "react";
import { menuItems, getHref } from "@/constants/menuItems";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" absolute top-0 left-0 right-0 z-50 h-25 backdrop-blur-xs border-b border-white/10 text-white">
      <div className="max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8 justify-center h-full">
        <div className="flex justify-between items-center h-full">
          <div className="shrink-0 mr-12">
            <Link href="/" className="text-2xl font-bold">
              <Logo width={75} height={75} src="/logos/logo-beli-pubquiz.png" />
            </Link>
          </div>
          <ul className="hidden md:flex space-x-15 text-md">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={getHref(item.href, user)}
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
        <div className="md:hidden bg-white/70 backdrop-blur-sm border-t border-pub-blue/50">
          <ul className="px-2 pt-2 pb-3 space-y-1 text-lg">
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={async () => {
                    router.push(getHref(item.href, user));
                    setIsOpen(false);
                  }}
                  className="block px-3 py-2 text-pub-blue font-semibold w-full text-left cursor-pointer border-pub-blue border-b  hover:bg-pub-blue/20 rounded transition-all duration-1000"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
