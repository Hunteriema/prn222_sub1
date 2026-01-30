"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: { name: string; description: string; price: number; image?: string }) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({
  product,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const nameTrim = name.trim();
    const descTrim = description.trim();
    const priceNum = parseFloat(price);
    if (!nameTrim) {
      setError("Name is required.");
      return;
    }
    if (!descTrim) {
      setError("Description is required.");
      return;
    }
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError("Price must be a non-negative number.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        name: nameTrim,
        description: descTrim,
        price: priceNum,
        image: image.trim() || undefined,
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          placeholder="Product name"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          placeholder="Product description"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Price *
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          placeholder="0.00"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Image URL (optional)
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          placeholder="https://..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-800 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
