"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/");
      else alert("Failed to delete product");
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !id) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="h-96 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="text-stone-600 dark:text-stone-400">Product not found.</p>
          <Link href="/" className="mt-4 inline-block font-medium text-stone-900 dark:text-stone-100">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = product.image?.trim() || PLACEHOLDER_IMAGE;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ← Back to shop
        </Link>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex">
          <div className="aspect-square w-full sm:w-80 shrink-0 bg-stone-100 dark:bg-stone-800">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {product.name}
            </h1>
            <p className="mt-2 text-lg font-semibold text-stone-600 dark:text-stone-400">
              ${product.price.toFixed(2)}
            </p>
            <p className="mt-4 flex-1 text-stone-600 dark:text-stone-400">
              {product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/products/${product.id}/edit`}
                className="rounded-full bg-stone-900 px-5 py-2.5 font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full border border-red-300 bg-white px-5 py-2.5 font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-stone-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
