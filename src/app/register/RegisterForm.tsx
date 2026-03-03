"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to register");
        return;
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
      router.push(redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Register to add products, manage your cart, and track orders.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="Repeat password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>
          <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-medium text-stone-900 underline dark:text-stone-100"
            >
              Login
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

