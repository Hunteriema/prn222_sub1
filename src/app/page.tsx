"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductsResponse } from "@/types/product";

export default function HomePage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", "12");
    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((json: ProductsResponse | { error: string }) => {
        if ("products" in json) setData(json);
        else setData({ products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } });
      })
      .catch(() =>
        setData({ products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } })
      )
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const pagination = data?.pagination;
  const products = data?.products ?? [];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <section className="border-b border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
            Clothing Store
          </h1>
          <p className="mt-3 text-lg text-stone-600 dark:text-stone-400">
            Browse our collection of apparel
          </p>
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
            <button
              type="submit"
              className="rounded-full bg-stone-900 px-5 py-2.5 font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            All Products
          </h2>
          <Link
            href="/products/new"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="text-stone-600 dark:text-stone-400">
              No products found.{" "}
              <Link href="/products/new" className="font-medium text-stone-900 underline dark:text-stone-100">
                Add your first product
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  Previous
                </button>
                <span className="px-4 text-sm text-stone-600 dark:text-stone-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
