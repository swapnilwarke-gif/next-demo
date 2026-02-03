"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="font-semibold text-lg">Expense App</h1>

        <div className="flex gap-2">
          <Link href="/profile" className={linkClass("/profile")}>
            Profile
          </Link>

          <Link href="/expenses" className={linkClass("/expenses")}>
            Expenses
          </Link>

          <button className="px-4 py-2 rounded text-red-600 hover:bg-red-100">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
