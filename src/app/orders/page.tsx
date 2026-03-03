"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderListItem {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

interface OrdersResponse {
  orders: OrderListItem[];
}

export default function OrdersPage() {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/orders");
          return null;
        }
        return res.json();
      })
      .then((json: OrdersResponse | null) => {
        if (json) setData(json);
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

  const orders = data?.orders ?? [];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Order history
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          View your past orders and their statuses.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white py-12 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-stone-600 dark:text-stone-400">
              You haven&apos;t placed any orders yet.{" "}
              <Link
                href="/"
                className="font-medium text-stone-900 underline dark:text-stone-100"
              >
                Start shopping
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

