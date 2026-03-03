"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CurrentUser {
  id: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const loadUser = () => {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : { user: null }))
        .then((data: { user: CurrentUser | null }) => {
          if (!cancelled) setUser(data.user);
        })
        .catch(() => {
          if (!cancelled) setUser(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    loadUser();

    const handleAuthChanged = () => {
      setLoading(true);
      // Defer reloading the user to avoid synchronous setState in the effect body
      setTimeout(loadUser, 0);
    };

    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

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
            href="/cart"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Cart
          </Link>
          {user && (
            <Link
              href="/orders"
              className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Orders
            </Link>
          )}
          {user && (
            <Link
              href="/products/new"
              className="hidden sm:inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Add Product
            </Link>
          )}
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                Sign up
              </Link>
            </>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

