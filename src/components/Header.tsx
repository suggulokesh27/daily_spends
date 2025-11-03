"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Daily Expense", href: "/expenses" },
  { name: "Advance", href: "/advance" },
  { name: "Members", href: "/members" },
  { name: "Handover", href: "/reports" },
  { name: "Bhiksha", href: "/bhiksha" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const authHandler = () => {
    if (user) {
      localStorage.clear();
      window.location.href = "/";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="text-xl font-semibold text-primary">
          🪔 Daily Spends
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Login/Logout Button */}
          <Button className="ml-4 bg-blue-500" onClick={authHandler}>
            {user ? "Logout" : "Login"}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Login/Logout Button */}
          <div className="px-4 py-3">
            <Button className="w-full bg-blue-500" onClick={authHandler}>
              {user ? "Logout" : "Login"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
