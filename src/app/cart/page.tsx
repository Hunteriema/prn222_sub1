"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  lineTotal: number;
}

interface CartResponse {
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [data, setData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadCart = useCallback(() => {
    setLoading(true);
    setError("");
    fetch("/api/cart")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/cart");
          return null;
        }
        return res.json();
      })
      .then((json: CartResponse | null) => {
        if (json) setData(json);
      })
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    // Initial load of cart contents; ignore lint here because this is expected
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadCart();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    setError("");
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        setError("Failed to update item");
        return;
      }
      loadCart();
    } catch {
      setError("Failed to update item");
    }
  };

  const handleRemove = async (productId: string) => {
    setError("");
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to remove item");
        return;
      }
      loadCart();
    } catch {
      setError("Failed to remove item");
    }
  };

  const hasItems = (data?.items.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Shopping Cart
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          Review the items in your cart before checking out.
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
                Continue shopping
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
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    className="flex-1 text-left"
                  >
                    <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                      {item.product.name}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product.id,
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className="w-20 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                    />
                    <p className="w-24 text-right text-sm font-medium text-stone-900 dark:text-stone-100">
                      ${item.lineTotal.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-end gap-4 sm:flex-row sm:justify-between">
              <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Total: ${data?.total.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

