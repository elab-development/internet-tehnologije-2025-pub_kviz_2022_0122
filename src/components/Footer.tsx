import Link from "next/link";
import { menuItems } from "../constants/menuItems";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="bg-pub-gray text-black z-10 relative bottom-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(255,255,255,0.85) 0%, transparent 65%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex justify-center items-center gap-3">
          <Link href="/" className="text-2xl font-bold">
            <Logo width={75} height={75} src="/pubquiz-logo.png" />
          </Link>
        </div>

        <nav className="mb-12 flex flex-wrap justify-center gap-x-12 gap-y-4 text-xl font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="opacity-90 hover:opacity-100 hover:scale-105 transition-transform duration-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/20" />

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-90">
          <p>© 2026 Pub Quiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}