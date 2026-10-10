"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { GridSkeleton, Skeleton } from "@/components/Skeleton";
import { toBn } from "@/lib/bn";
import { useCategories, useProducts } from "@/lib/use-data";

type Sort = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, loading, error } = useProducts();
  const { data: cats } = useCategories();
  const [sort, setSort] = useState<Sort>("default");

  const items = useMemo(() => {
    const list = (products ?? []).filter((p) => p.category === slug);
    // numeric comparison on the raw number (never on Bengali strings)
    if (sort === "asc") return [...list].sort((a, b) => a.today - b.today);
    if (sort === "desc") return [...list].sort((a, b) => b.today - a.today);
    return list;
  }, [products, slug, sort]);

  if (loading || (!cats && !error)) {
    return (
      <div className="container-x space-y-4 py-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <GridSkeleton n={6} />
      </div>
    );
  }

  const cat = cats?.find((c) => c.slug === slug);
  if (error || !cat || items.length === 0 && sort === "default") {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-6xl">🔍</div>
        <h1 className="mt-4 text-4xl font-bold text-brand">৪০৪</h1>
        <p className="mt-2 text-lg font-semibold">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
        <Link href="/" className="btn-primary mt-6">হোম পেজে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="container-x space-y-4 py-6">
      <div className="card flex items-center gap-4 p-6">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{cat.nameBn}</h1>
          <p className="text-sm text-neutral-500">{toBn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <div className="card flex items-center justify-end gap-3 p-4">
        <label htmlFor="sort" className="text-sm text-neutral-500">সাজান</label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none rounded-lg border border-line bg-card py-2 pl-3 pr-9 text-sm outline-none focus:border-brand"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <p className="text-sm text-neutral-500">মোট {toBn(items.length)}টি পণ্য দেখানো হচ্ছে</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
