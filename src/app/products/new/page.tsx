"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    image?: string;
  }) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Failed to create product");
    }
    const product = await res.json();
    router.push(`/products/${product.id}`);
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ← Back to shop
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Add Product
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            Create a new clothing product
          </p>
          <div className="mt-8">
            <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
          </div>
        </div>
      </div>
    </main>
  );
}
