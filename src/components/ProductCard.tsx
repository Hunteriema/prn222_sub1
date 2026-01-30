import Link from "next/link";
import type { Product } from "@/types/product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop";

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image?.trim() || PLACEHOLDER_IMAGE;
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
    >
      <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
