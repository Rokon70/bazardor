import Link from "next/link";
import Badge from "./Badge";
import { fmtNum, getChange, unitBn } from "@/lib/bn";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="card block p-4 transition hover:border-brand/40 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-2xl">{p.image}</div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold leading-tight">{p.nameBn}</h3>
          <p className="text-xs text-neutral-500">প্রতি {unitBn(p.unit)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-500">আজকের দাম</p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold">{fmtNum(p.today)} <span className="text-sm font-medium">টাকা</span></p>
        <Badge change={getChange(p)} />
      </div>
    </Link>
  );
}
