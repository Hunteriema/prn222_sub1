"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
  };
}

interface OrderDetail {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderResponse {
  order: OrderDetail;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push(`/login?redirect=/orders/${orderId}`);
          return null;
        }
        return res.json();
      })
      .then((json: OrderResponse | null) => {
        if (json) setData(json.order);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const success = searchParams.get("success") === "1";

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/orders"
          className="mb-4 inline-flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ← Back to orders
        </Link>

        {loading || !orderId ? (
          <div className="mt-4 h-48 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        ) : error || !data ? (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-6 text-stone-700 shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            {error || "Order not found."}
          </div>
        ) : (
          <div className="space-y-6">
            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100">
                Payment successful! Your order has been placed.
              </div>
            )}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Order #{data.id.slice(0, 8)}
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                Placed on {new Date(data.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Status: {data.status}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Items
              </h2>
              <div className="mt-4 space-y-3">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-400">
                        {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 text-sm dark:border-stone-700">
                <p className="font-medium text-stone-700 dark:text-stone-300">
                  Total
                </p>
                <p className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  ${data.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

