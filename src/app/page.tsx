"use client";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { GridSkeleton } from "@/components/Skeleton";
import { getChange, toBn } from "@/lib/bn";
import { useProducts } from "@/lib/use-data";
import type { Product } from "@/lib/types";

const grid = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

function top6(list: Product[], dir: "up" | "down") {
  return list
    .filter((p) => getChange(p).dir === dir)
    .sort((a, b) => getChange(b).pct - getChange(a).pct)
    .slice(0, 6);
}

export default function Home() {
  const { data, error, loading } = useProducts();

  return (
    <div className="container-x space-y-10 py-6">
      <Hero />
      {error && <p className="card p-6 text-center text-up">ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।</p>}

      <section>
        <h2 className="mb-4 text-xl font-bold"><span className="mr-2 text-up">▲</span>আজ দাম বেড়েছে</h2>
        {loading ? <GridSkeleton /> : <div className={grid}>{top6(data ?? [], "up").map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold"><span className="mr-2 text-down">▼</span>আজ দাম কমেছে</h2>
        {loading ? <GridSkeleton /> : <div className={grid}>{top6(data ?? [], "down").map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>

      <section id="সব-পণ্য" className="scroll-mt-4">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="mb-4 text-sm text-neutral-500">{data ? `মোট ${toBn(data.length)}টি পণ্য দেখানো হচ্ছে` : "লোড হচ্ছে…"}</p>
        {loading ? <GridSkeleton n={9} /> : <div className={grid}>{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>
    </div>
  );
}
