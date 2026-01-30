"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
  }) => {
    if (!id) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Failed to update product");
    }
    router.push(`/products/${id}`);
  };

  if (loading || !id) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <div className="h-64 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          <p className="text-stone-600 dark:text-stone-400">Product not found.</p>
          <Link href="/" className="mt-4 inline-block font-medium text-stone-900 dark:text-stone-100">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <Link
          href={`/products/${id}`}
          className="mb-8 inline-flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ← Back to product
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Edit Product
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            Update product details
          </p>
          <div className="mt-8">
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
