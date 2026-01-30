"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-stone-800 dark:bg-stone-950/95 dark:supports-[backdrop-filter]:bg-stone-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100"
        >
          Threads
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Shop
          </Link>
          <Link
            href="/products/new"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
}
