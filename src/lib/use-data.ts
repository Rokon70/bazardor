"use client";
import { useEffect, useState } from "react";
import { getJSON } from "./api";
import type { Category, Product } from "./types";

// module-level cache so Navbar, Ticker and pages share one request
let productsP: Promise<Product[]> | null = null;
let categoriesP: Promise<Category[]> | null = null;

function useCached<T>(get: () => Promise<T>, read: () => Promise<T> | null, reset: () => void) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    (read() ?? get())
      .then((d) => alive && setData(d))
      .catch(() => { reset(); alive && setError(true); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loading: !data && !error };
}

export const useProducts = () =>
  useCached<Product[]>(
    () => (productsP = getJSON<Product[]>("/products")),
    () => productsP,
    () => (productsP = null)
  );

export const useCategories = () =>
  useCached<Category[]>(
    () => (categoriesP = getJSON<Category[]>("/categories")),
    () => categoriesP,
    () => (categoriesP = null)
  );
