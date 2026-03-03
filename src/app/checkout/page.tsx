"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CheckoutCartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
  lineTotal: number;
}

interface CheckoutCartResponse {
  items: CheckoutCartItem[];
  total: number;
}

export default function CheckoutPage() {
  const [data, setData] = useState<CheckoutCartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/checkout");
          return null;
        }
        return res.json();
      })
      .then((json: CheckoutCartResponse | null) => {
        if (json) setData(json);
      })
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!data || data.items.length === 0) return;
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markPaid: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to place order");
        return;
      }
      const orderId = json.order?.id;
      if (orderId) {
        router.push(`/orders/${orderId}?success=1`);
      } else {
        router.push("/orders");
      }
    } catch {
      setError("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const hasItems = (data?.items.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Checkout
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          Confirm your order details.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        ) : !hasItems ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white py-12 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-stone-600 dark:text-stone-400">
              Your cart is empty.{" "}
              <Link
                href="/"
                className="font-medium text-stone-900 underline dark:text-stone-100"
              >
                Go back to shop
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {data?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-stone-800 dark:bg-stone-900"
                >
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-400">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    ${item.lineTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Total
              </p>
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                ${data?.total.toFixed(2)}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link
                href="/cart"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              >
                ← Back to cart
              </Link>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                {placing ? "Processing…" : "Confirm & place order"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

