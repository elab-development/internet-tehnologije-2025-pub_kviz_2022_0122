'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Events' },
    { href: '/profile', label: 'Profile' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 bg-transparent h-25 text-black shadow-lg z-50 justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0 mr-12">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              <Image src="/pubquiz-logo.png" alt="PubQuiz Logo" width={75} height={75} />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-lg">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-pub-gray transition duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-700 transition"
            >
              <svg
                className={`h-6 w-6 transition ${isOpen ? 'rotate-90' : ''}`}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-700">
          <ul className="px-2 pt-2 pb-3 space-y-1 text-lg">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded-md hover:bg-slate-600 transition"
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
